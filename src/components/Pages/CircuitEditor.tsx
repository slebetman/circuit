import { FC, useCallback, useRef } from 'react';
import Flow from 'components/Flow/Flow';
import { addEdge, Connection, Edge } from 'reactflow';
import ToolPanel from 'components/Panels/ToolPanel';
import ErrorDialog from 'components/Dialogs/ErrorDialog';
import * as handlers from './Handlers';
import { setEditorContext } from 'lib/editorContext';
import Dialogs from './Dialogs';
import { useEditorState } from 'hooks/useEditorState';
import { StatusPanel } from 'components/Panels/StatusPanel';
import { Effects } from './Effects';

type EditorProps = {
	fileName?: string;
};

const CircuitEditor: FC<EditorProps> = ({ fileName }) => {
	const ctx = useEditorState();

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
	setEditorContext({
		chartContainerRef,
	});

	return (
		<>
			<Effects ctx={ctx} fileName={fileName} />
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
					<StatusPanel />
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
