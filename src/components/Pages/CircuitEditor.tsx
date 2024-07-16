import { CSSProperties, FC, useCallback, useEffect, useRef } from 'react';
import Flow from 'components/Flow/Flow';

import { Module } from 'hooks/useChart';
import { compile } from 'lib/compiler';
import { addEdge, Connection, Edge, Panel } from 'reactflow';
import ToolPanel from 'components/ToolPanel/ToolPanel';
import ErrorDialog from 'components/Dialogs/ErrorDialog';
import { setChartRef } from 'lib/chartRefs';
import * as handlers from './Handlers';
import { setEditorContext } from 'lib/editorContext';
import Dialogs from './Dialogs';
import { useEditorContext } from 'hooks/useEditorContext';

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
	const ctx = useEditorContext();

	const onConnect = useCallback(
		(params: Connection | Edge) => {
			const e = params as Edge<any>;
			e.data = {};
			if (ctx.mode === 'module') {
				ctx.setModuleEdges((eds) => addEdge(e, eds));
			} else {
				ctx.setEdges((eds) => addEdge(e, eds));
			}
		},
		[ctx.setEdges, ctx.setModuleEdges, ctx.mode],
	);

	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (ctx.instance && ctx.codeOpen) {
			const n = ctx.instance.getNodes();
			const e = ctx.instance.getEdges();

			ctx.setCode(
				compile({
					nodes: n,
					edges: e,
				}).map((x) => x.replace(/this\["(.+?)"\]/g, '$1')),
			);
		}
	}, [ctx.codeOpen, ctx.nodes, ctx.edges]);

	useEffect(() => {
		if (ctx.chart.chart) {
			// HACK: Not sure why but need some delay to set nodes
			ctx.setNodes([]);
			ctx.setEdges([]);
			ctx.setModules([]);
			setTimeout(() => {
				ctx.setNodes(ctx.chart.chart?.nodes || []);
				ctx.setEdges(ctx.chart.chart?.edges || []);
				ctx.setModules(ctx.chart.chart?.modules || []);
				setTimeout(() => {
					ctx.instance?.fitView({
						padding: 0.25,
					});
				}, 50);
			}, 0);
		}
	}, [ctx.chart.chart]);

	useEffect(() => {
		const name = ctx.mod.name;
		const found = ctx.modules.find((x) => x.label === name);

		if (found) {
			return ctx.setError('Module has already been imported!');
		}

		if (ctx.mod.chart?.modules && ctx.mod.chart.modules.length > 0) {
			return ctx.setError('Cannot import modules containing modules!');
		}

		if (ctx.mod.chart) {
			ctx.setModules((prevModules) => {
				const m = [
					...prevModules,
					{
						label: ctx.mod.name,
						type: ctx.mod.name,
						nodes: ctx.mod.chart?.nodes,
						edges: ctx.mod.chart?.edges,
					} as Module,
				];
				return m;
			});
		}
	}, [ctx.mod.chart]);

	useEffect(() => {
		if (fileName) {
			ctx.chart.load(fileName);
		}
	}, [fileName]);

	useEffect(() => {
		setChartRef({
			nodes: ctx.nodes,
			edges: ctx.edges,
			modules: ctx.modules,
		});
	}, [ctx.nodes, ctx.edges, ctx.modules]);

	useEffect(() => {
		if (ctx.chart.error) {
			ctx.setError(ctx.chart.error.message);
		}
		if (ctx.mod.error) {
			ctx.setError(ctx.mod.error.message);
		}
	}, [ctx.chart.error, ctx.mod.error]);

	setEditorContext({
		chartContainerRef,
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
					nodes={ctx.mode === 'module' ? ctx.moduleNodes : ctx.nodes}
					edges={ctx.mode === 'module' ? ctx.moduleEdges : ctx.edges}
					onConnect={onConnect}
					onNodesChange={
						ctx.mode === 'module' ?
							ctx.onModuleNodesChange
						:	ctx.onNodesChange
					}
					onEdgesChange={
						ctx.mode === 'module' ?
							ctx.onModuleEdgesChange
						:	ctx.onEdgesChange
					}
					onInit={(i) => ctx.setInstance(i)}
					editable={ctx.editable}
					onNodeDoubleClick={(e, n) => {
						if (n.type === 'module') {
							handlers.handleEditModule(n);
						}
					}}
				>
					{ctx.sim ?
						<Panel position='top-center' style={titlePanelStyle}>
							Simulation running..
							{ctx.mode === 'module' && (
								<span style={{marginLeft:'10px'}}>
									Module: {ctx.currentModule?.label}
								</span>
							)}
						</Panel>
					: ctx.mode === 'module' ?
						<Panel position='top-center' style={titlePanelStyle}>
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
								value={ctx.currentModule?.label}
								onChange={(e) => {
									const val = e.currentTarget?.value;

									if (val !== undefined) {
										ctx.setCurrentModule((prevModule) => {
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
					:	''}
					<ToolPanel
						mode={ctx.mode === 'module' ? 'module' : 'chart'}
						position='top-left'
						simRunning={ctx.sim !== null}
						handlers={{
							open: handlers.handleOpenFolder,
							save: handlers.handleSaveDialog,
							new: handlers.handleNew,
							compile: handlers.handleCompile(ctx.setCodeOpen),
							run: handlers.handleSim,
							tools: handlers.handleTools(
								ctx.setNodesPaletteOpen,
								ctx.setModulesPaletteOpen,
							),
							backToChart: handlers.handleSaveModule,
						}}
					/>
				</Flow>
			</div>
			<Dialogs
				fileName={fileName || ''}
				isOpen={{
					nodes: ctx.nodesPaletteOpen,
					modules: ctx.modulesPaletteOpen,
				}}
				onClose={{
					nodes: () => ctx.setNodesPaletteOpen(false),
					modules: () => ctx.setModulesPaletteOpen(false),
				}}
			/>
			<ErrorDialog
				isOpen={ctx.error != null}
				onClose={() => ctx.setError(null)}
				error={ctx.error || ''}
			/>
		</>
	);
};

export default CircuitEditor;
