import { CSSProperties, FC, useCallback, useEffect, useState } from 'react';
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
import * as handlers from './Handlers';
import generateId from 'lib/generateId';

type EditorProps = {
	fileName?: string;
};

const titleFont: CSSProperties = {
	fontSize: '20px',
};

const titlePanelStyle: CSSProperties = {
	...titleFont,
	backgroundColor: '#ccc',
	padding: '10px',
	borderRadius: '10px',
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
	const [currentModule, setCurrentModule] = useState<Module | null>(null);
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
		(params: Connection | Edge) => {
			if (mode === 'module') {
				setModuleEdges((eds) => addEdge(params, eds));
			} else {
				setEdges((eds) => addEdge(params, eds));
			}
		},
		[setEdges, setModuleEdges, mode]
	);
	const chart = useChart();
	const mod = useChart();
	const router = useRouter();

	const handleCreateModule = () => {
		setCurrentModule({
			type: `${generateId(instance)}`,
			label: '',
			nodes: [],
			edges: [],
		});
		setModuleEdges([]);
		setModuleNodes([]);
		setMode('module');
		setTimeout(() => {
			instance?.fitView({
				padding: 0.25,
			});
		}, 50);
	};

	const handleEditModule = (type: string) => {
		const m = modules.find((x) => x.type === type);

		if (m) {
			setCurrentModule(m);
			setModuleEdges(m.edges);
			setModuleNodes(m.nodes);
			setMode('module');
			setTimeout(() => {
				instance?.fitView({
					padding: 0.25,
				});
			}, 50);
		}
	};

	const handleSaveModule = () => {
		console.log('currentModule', currentModule?.label, currentModule?.type);
		console.log(moduleNodes);
		if (currentModule) {
			setModules((prevModules) => {
				const m = prevModules.filter(
					(m) => m.type !== currentModule.type
				);
				m.push({
					type: currentModule.type,
					label: currentModule.label,
					nodes: [...moduleNodes],
					edges: [...moduleEdges],
				});
				return m;
			});
			setMode('chart');
			setTimeout(() => {
				instance?.fitView({
					padding: 0.25,
				});
			}, 50);
		}
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
				}).map((x) => x.replace(/this\["(.+?)"\]/g, '$1'))
			);
		}
	}, [codeOpen, nodes, edges]);

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
					nodes={mode === 'module' ? moduleNodes : nodes}
					edges={mode === 'module' ? moduleEdges : edges}
					onConnect={onConnect}
					onNodesChange={
						mode === 'module' ? onModuleNodesChange : onNodesChange
					}
					onEdgesChange={
						mode === 'module' ? onModuleEdgesChange : onEdgesChange
					}
					onInit={(i) => setInstance(i)}
					editable={editable}
					onNodeDoubleClick={(e, n) => {
						if (n.type === 'module') {
							handleEditModule(n.data.type);
						}
					}}
				>
					{sim && (
						<Panel position='top-center' style={titlePanelStyle}>
							Simulation running..
						</Panel>
					)}
					{mode === 'module' && (
						<Panel position='top-center' style={titlePanelStyle}>
							Edit Module:{' '}
							<input
								style={{
									...titleFont,
									padding: '5px 10px',
									borderRadius: '5px',
									border: '1px solid #999',
								}}
								type='text'
								value={currentModule?.label}
								onChange={(e) => {
									const val = e.currentTarget?.value;

									if (val !== undefined) {
										setCurrentModule((prevModule) => {
											if (prevModule) {
												return {
													...prevModule,
													label: val,
												};
											}
											return null;
										});
									}
								}}
							/>
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
							backToChart: handleSaveModule,
						}}
					/>
				</Flow>
			</div>
			<NodesDialog
				isOpen={nodesPaletteOpen}
				onClick={handlers.handleCreateNode(
					mode === 'module' ? setModuleNodes : setNodes,
					instance
				)}
				onClose={() => setNodesPaletteOpen(false)}
			/>
			<ModulesDialog
				isOpen={modulesPaletteOpen}
				onClick={handlers.handleCreateNode(
					mode === 'module' ? setModuleNodes : setNodes,
					instance
				)}
				onClose={() => setModulesPaletteOpen(false)}
				importModule={() => setMode('import')}
				createModule={handleCreateModule}
				editModule={handleEditModule}
				deleteModule={handlers.handleDeleteModule(
					setModules,
					instance,
					nodes
				)}
				modules={modules}
				visible={mode !== 'module'}
			/>
			<CodeDialog
				isOpen={codeOpen}
				onClose={() => setCodeOpen(false)}
				code={code}
			/>
			<FilePicker
				title='Open File'
				isOpen={mode === 'open'}
				onSelect={handlers.handleSelectFile(
					stopSim,
					setMode,
					router,
					fileName,
					chart
				)}
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
