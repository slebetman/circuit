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
import generateId from 'lib/generateId';
import { setChartRef } from 'lib/chartRefs';
import ModulesDialog from 'components/Dialogs/ModulesDialog';

type EditorProps = {
	fileName?: string;
};

const CircuitEditor: FC<EditorProps> = ({ fileName }) => {
	const [nodes, setNodes, onNodesChange] = useNodesState([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState([]);
	const [modules, setModules] = useState<Module[]>([]);
	const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
	const [mode, setMode] = useState<'open' | 'save' | 'chart'>('chart');
	const [nodesPaletteOpen, setNodesPaletteOpen] = useState(false);
	const [modulesPaletteOpen, setModulesPaletteOpen] = useState(false);
	const [codeOpen, setCodeOpen] = useState(false);
	const [code, setCode] = useState<string[]>([]);
	const [sim, setSim] = useState<SimObject | null>(null);
	const [editable, setEditable] = useState(true);
	const onConnect = useCallback(
		(params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
		[setEdges],
	);
	const chart = useChart();

	const router = useRouter();

	const handleNew = () => {
		stopSim();
		setNodes([]);
		setEdges([]);
		router.replace('/');
	};

	const handleSaveDialog = () => {
		setMode('save');
	};

	const handleSave = (name: string) => {
		if (name) {
			chart.setName(name);
			chart.save({ nodes, edges, modules });
			router.replace(`/${name}`);
		}

		setMode('chart');
	};

	const handleOpenFolder = () => {
		setMode('open');
	};

	const handleSelectFile = (f: string) => {
		stopSim();
		setMode('chart');
		router.replace(`/${f}`);
	};

	const handleCompile = () => {
		setCodeOpen(true);
	};

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
			}),
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
				}),
			);
			setEdges((prevEdges) =>
				prevEdges.map((e) => {
					e.data = {
						on: state[varName(e.id)],
					};
					return e;
				}),
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
				}),
			);
			setEdges((prevEdges) =>
				prevEdges.map((e) => {
					e.data = {};
					return e;
				}),
			);

			setSim(null);
		}
	};

	const handleSim = (active: boolean) => {
		if (active) {
			startSim();
		} else {
			stopSim();
		}
	};

	const handleCreateNode = (actionType: string) => {
		setNodes((prev) => {
			let data: Record<string, any> = {};

			switch (actionType) {
				case 'comment':
				case 'in':
				case 'out':
					data.label = actionType;
					break;
			}

			return [
				...prev,
				{
					id: `${generateId(instance)}`,
					type: actionType,
					data,
					position: {
						x: 0,
						y: 0,
					},
				},
			];
		});
	};

	const handleTools = (toolType: string) => {
		switch (toolType) {
			case 'nodes':
				return setNodesPaletteOpen(true);
			case 'modules':
				return setModulesPaletteOpen(true);
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
				}),
			);
		}
	}, [codeOpen, nodes, edges]);

	useEffect(() => {
		if (chart.chart) {
			// HACK: Not sure why but need some delay to set nodes
			setNodes([]);
			setEdges([]);
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
		if (fileName) {
			chart.load(fileName);
		}
	}, [fileName]);

	useEffect(() => {
		setChartRef({ nodes, edges, modules });
	}, [nodes, edges, modules]);

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
						position='top-left'
						simRunning={sim !== null}
						handlers={{
							open: handleOpenFolder,
							save: handleSaveDialog,
							new: handleNew,
							compile: handleCompile,
							run: handleSim,
							tools: handleTools,
						}}
					/>
				</Flow>
			</div>
			<NodesDialog
				isOpen={nodesPaletteOpen}
				onClick={handleCreateNode}
				onClose={() => setNodesPaletteOpen(false)}
			/>
			<ModulesDialog
				isOpen={modulesPaletteOpen}
				onClick={(x) => console.log(x)}
				onClose={() => setModulesPaletteOpen(false)}
			/>
			<CodeDialog
				isOpen={codeOpen}
				onClose={() => setCodeOpen(false)}
				code={code}
			/>
			<FilePicker
				isOpen={mode === 'open'}
				onSelect={handleSelectFile}
				onClose={() => setMode('chart')}
			/>
			<SaveDialog
				isOpen={mode === 'save'}
				name={chart.name}
				onSubmit={handleSave}
				onClose={() => setMode('chart')}
			/>
			<ErrorDialog
				isOpen={chart.error != null}
				onClose={() => chart.clearError()}
				error={chart.error?.message || ''}
			/>
		</>
	);
};

export default CircuitEditor;
