import { FC, useCallback, useEffect, useState } from 'react';
import Flow from 'components/Flow/Flow';

import useChart, { Module } from 'hooks/useChart';
import FilePicker from 'components/Dialogs/FilePicker';
import SaveDialog from 'components/Dialogs/SaveDialog';
import NodesDialog from 'components/Dialogs/NodesDialog';
import { compile } from 'lib/compiler';
import CodeDialog from 'components/Dialogs/CodeDialog';
import { useRouter } from 'next/router';
import {
	addEdge,
	Connection,
	Edge,
	Panel,
	ReactFlowInstance,
	useEdgesState,
	useNodesState,
} from 'reactflow';
import ToolPanel from 'components/ToolPanel/ToolPanel';
import { SimObject, SimState, simulator } from 'lib/simulator';
import varName from 'lib/normaliseVarName';
import ErrorDialog from 'components/Dialogs/ErrorDialog';
import { setChartRef } from 'lib/chartRefs';
import ModulesDialog from 'components/Dialogs/ModulesDialog';
import handlers from './Handlers';

type EditorProps = {
	fileName?: string;
};

const CircuitEditor: FC<EditorProps> = ({ fileName }) => {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [moduleNodes, setModuleNodes, onModuleNodesChange] = useNodesState(
		[]
	);
	const [moduleEdges, setModuleEdges, onModuleEdgesChange] = useEdgesState(
		[]
	);
	const [modules, setModules] = useState<Module[]>([]);
	const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
	const [mode, setMode] = useState<
		'open' | 'import' | 'save' | 'chart' | 'module'
	>('chart');
	const [nodesPaletteOpen, setNodesPaletteOpen] = useState(false);
	const [modulesPaletteOpen, setModulesPaletteOpen] = useState(false);
	const [codeOpen, setCodeOpen] = useState(false);
	const [code, setCode] = useState<string[]>([]);
	const [sim, setSim] = useState<SimObject | null>(null);
	const [editable, setEditable] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const onConnect = useCallback(
		(params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
		[setEdges]
	);
	const chart = useChart();
	const mod = useChart();
	const router = useRouter();

	const startSim = () => {
		setEditable(false);
		const s = simulator({
			nodes,
			edges,
		});

		setNodes((nodes) =>
			nodes.map((n) => {
				if (n.data) {
					n.data = {
						...n.data,
						sim: (state: boolean) => s.set(n.id, state),
					};
				}
				return n;
			})
		);

		const updater = (state: SimState) => {
			setNodes((prevNodes) =>
				prevNodes.map((n) => {
					if (state[n.id] !== undefined) {
						n.data = {
							...n.data,
							on: state[n.id],
						};
					}
					return n;
				})
			);
			setEdges((prevEdges) =>
				prevEdges.map((e) => {
					e.data = {
						on: state[varName(e.id)],
					};
					return e;
				})
			);
		};

		s.start(updater);
		setSim(s);
	};

	const stopSim = () => {
		setEditable(true);

		if (sim) {
			sim.stop();

			setNodes((prevNodes) =>
				prevNodes.map((n) => {
					if (n.data) {
						delete n.data.on;
						delete n.data.sim;
						n.data = {
							...n.data,
						};
					}
					return n;
				})
			);
			setEdges((prevEdges) =>
				prevEdges.map((e) => {
					e.data = {};
					return e;
				})
			);

			setSim(null);
		}
	};

	useEffect(() => {
		if (instance && codeOpen) {
			const n = instance.getNodes();
			const e = instance.getEdges();

			setCode(
				compile({
					nodes: n,
					edges: e,
				})
			);
		}
	}, [codeOpen, nodes, edges]);

	const handleDeleteModule = (type: string) => {
		setModules((prevModules) => {
			const newModules = prevModules.filter((x) => x.type !== type);
			return newModules;
		});
		instance?.deleteElements({
			nodes: nodes.filter(
				(x) => x.type === 'module' && x.data.type === type
			),
		});
	};

	useEffect(() => {
		if (chart.chart) {
			// HACK: Not sure why but need some delay to set nodes
			setNodes([]);
			setEdges([]);
			setModules([]);
			setTimeout(() => {
				setNodes(chart.chart?.nodes || []);
				setEdges(chart.chart?.edges || []);
				setModules(chart.chart?.modules || []);
				setTimeout(() => {
					instance?.fitView({
						padding: 0.25,
					});
				}, 50);
			}, 0);
		}
	}, [chart.chart]);

	useEffect(() => {
		const name = mod.name;
		const found = modules.find((x) => x.label === name);

		if (found) {
			return setError('Module has already been imported!');
		}

		if (mod.chart?.modules && mod.chart.modules.length > 0) {
			return setError('Cannot import modules containing modules!');
		}

		if (mod.chart) {
			setModules((prevModules) => {
				const m = [
					...prevModules,
					{
						label: mod.name,
						type: mod.name,
						nodes: mod.chart?.nodes,
						edges: mod.chart?.edges,
					} as Module,
				];
				return m;
			});
		}
	}, [mod.chart]);

	useEffect(() => {
		if (fileName) {
			chart.load(fileName);
		}
	}, [fileName]);

	useEffect(() => {
		setChartRef({ nodes, edges, modules });
	}, [nodes, edges, modules]);

	useEffect(() => {
		if (chart.error) {
			setError(chart.error.message);
		}
		if (mod.error) {
			setError(mod.error.message);
		}
	}, [chart.error, mod.error]);

	return (
		<>
			<div
				style={{
					flexGrow: 1,
					fontSize: '12px',
				}}
			>
				<Flow
					nodes={nodes}
					edges={edges}
					onConnect={onConnect}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onInit={(i) => setInstance(i)}
					editable={editable}
				>
					{sim && (
						<Panel position='top-center'>
							Simulation running..
						</Panel>
					)}
					<ToolPanel
						mode={mode === 'module' ? 'module' : 'chart'}
						position='top-left'
						simRunning={sim !== null}
						handlers={{
							open: handlers.handleOpenFolder(setMode),
							save: handlers.handleSaveDialog(setMode),
							new: handlers.handleNew(
								stopSim,
								setNodes,
								setEdges,
								setModules,
								router
							),
							compile: handlers.handleCompile(setCodeOpen),
							run: handlers.handleSim(startSim, stopSim),
							tools: handlers.handleTools(
								setNodesPaletteOpen,
								setModulesPaletteOpen
							),
							backToChart: () => {
								setMode('chart');
							},
						}}
					/>
				</Flow>
			</div>
			<NodesDialog
				isOpen={nodesPaletteOpen}
				onClick={handlers.handleCreateNode(setNodes, instance)}
				onClose={() => setNodesPaletteOpen(false)}
			/>
			<ModulesDialog
				isOpen={modulesPaletteOpen}
				onClick={handlers.handleCreateNode(setNodes, instance)}
				onClose={() => setModulesPaletteOpen(false)}
				importModule={() => setMode('import')}
				deleteModule={handleDeleteModule}
				modules={modules}
			/>
			<CodeDialog
				isOpen={codeOpen}
				onClose={() => setCodeOpen(false)}
				code={code}
			/>
			<FilePicker
				title='Open File'
				isOpen={mode === 'open'}
				onSelect={handlers.handleSelectFile(stopSim, setMode, router)}
				onClose={() => setMode('chart')}
			/>
			<FilePicker
				title='Import Module'
				isOpen={mode === 'import'}
				onSelect={(fileName) => {
					setMode('chart');
					mod.load(fileName);
				}}
				onClose={() => setMode('chart')}
			/>
			<SaveDialog
				isOpen={mode === 'save'}
				name={chart.name}
				onSubmit={handlers.handleSave(
					chart,
					router,
					setMode,
					nodes,
					edges,
					modules
				)}
				onClose={() => setMode('chart')}
			/>
			<ErrorDialog
				isOpen={error != null}
				onClose={() => setError(null)}
				error={error || ''}
			/>
		</>
	);
};

export default CircuitEditor;
