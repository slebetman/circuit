import {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import Flow from 'components/Flow/Flow';

import useChart, { Module } from 'hooks/useChart';
import { compile, compileNonRecursive } from 'lib/compiler';
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
import { SimObject } from 'lib/simulator';
import ErrorDialog from 'components/Dialogs/ErrorDialog';
import { setChartRef } from 'lib/chartRefs';
import * as handlers from './Handlers';
import { EditorMode, setEditorContext } from 'lib/editorContext';
import Dialogs from './Dialogs';

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
		[],
	);
	const [moduleEdges, setModuleEdges, onModuleEdgesChange] = useEdgesState(
		[],
	);
	const [modules, setModules] = useState<Module[]>([]);
	const [currentModule, setCurrentModule] = useState<Module | null>(null);
	const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
	const [mode, setMode] = useState<EditorMode>('chart');
	const [nodesPaletteOpen, setNodesPaletteOpen] = useState(false);
	const [modulesPaletteOpen, setModulesPaletteOpen] = useState(false);
	const [codeOpen, setCodeOpen] = useState(false);
	const [code, setCode] = useState<string[]>([]);
	const [sim, setSim] = useState<SimObject | null>(null);
	const [editable, setEditable] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const onConnect = useCallback(
		(params: Connection | Edge) => {
			const e = params as Edge<any>;
			e.data = {};
			if (mode === 'module') {
				setModuleEdges((eds) => addEdge(e, eds));
			} else {
				setEdges((eds) => addEdge(e, eds));
			}
		},
		[setEdges, setModuleEdges, mode],
	);
	const chart = useChart();
	const mod = useChart();
	const router = useRouter();

	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (instance && codeOpen) {
			const n = instance.getNodes();
			const e = instance.getEdges();

			setCode(
				compileNonRecursive({
					nodes: n,
					edges: e,
				}).map((x) => x.replace(/this\["(.+?)"\]/g, '$1')),
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

	setEditorContext({
		chartContainerRef,
		currentModule,
		setCurrentModule,
		modules,
		setModules,
		nodes,
		setNodes,
		onNodesChange,
		edges,
		setEdges,
		onEdgesChange,
		mode,
		setMode,
		moduleNodes,
		setModuleNodes,
		onModuleNodesChange,
		moduleEdges,
		setModuleEdges,
		onModuleEdgesChange,
		router,
		instance,
		setEditable,
		chart,
		mod,
		setSim,
		sim,
		code,
		codeOpen,
		setCodeOpen,
	});

	return (
		<>
			<div
				ref={chartContainerRef}
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
							handlers.handleEditModule(n);
						}
					}}
				>
					{sim && mode !== 'module' && (
						<Panel position='top-center' style={titlePanelStyle}>
							Simulation running..
						</Panel>
					)}
					{mode === 'module' && (
						<Panel position='top-center' style={titlePanelStyle}>
							{!sim ?
								<>
									<span style={{ marginRight: '5px' }}>
										Edit Module:
									</span>
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
												setCurrentModule(
													(prevModule) => {
														if (prevModule) {
															return {
																...prevModule,
																label: val,
															};
														}
														return null;
													},
												);
											}
										}}
									/>
								</>
							:	<span>
									Simulation running.. Module:{' '}
									{currentModule?.label}
								</span>
							}
						</Panel>
					)}
					<ToolPanel
						mode={mode === 'module' ? 'module' : 'chart'}
						position='top-left'
						simRunning={sim !== null}
						handlers={{
							open: handlers.handleOpenFolder,
							save: handlers.handleSaveDialog,
							new: handlers.handleNew,
							compile: handlers.handleCompile(setCodeOpen),
							run: handlers.handleSim,
							tools: handlers.handleTools(
								setNodesPaletteOpen,
								setModulesPaletteOpen,
							),
							backToChart: handlers.handleSaveModule,
						}}
					/>
				</Flow>
			</div>
			<Dialogs
				fileName={fileName || ''}
				isOpen={{
					nodes: nodesPaletteOpen,
					modules: modulesPaletteOpen,
				}}
				onClose={{
					nodes: () => setNodesPaletteOpen(false),
					modules: () => setModulesPaletteOpen(false),
				}}
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
