import CodeDialog from 'components/Dialogs/CodeDialog';
import FilePicker from 'components/Dialogs/FilePicker';
import ModulesDialog from 'components/Dialogs/ModulesDialog';
import NodesDialog from 'components/Dialogs/NodesDialog';
import SaveDialog from 'components/Dialogs/SaveDialog';
import { FC } from 'react';
import * as handlers from './Handlers';
import { getEditorContext } from 'lib/editorContext';

const ctx = getEditorContext();

type DialogStates = {
	nodes: boolean;
	modules: boolean;
};

type DialogCloseActions = {
	nodes: () => void;
	modules: () => void;
};

type DialogsProps = {
	fileName: string;
	isOpen: DialogStates;
	onClose: DialogCloseActions;
};

const Dialogs: FC<DialogsProps> = ({ fileName, isOpen, onClose }) => {
	return (
		<>
			<NodesDialog
				isOpen={isOpen.nodes}
				onClick={handlers.handleCreateNode}
				onClose={onClose.nodes}
			/>
			<ModulesDialog
				isOpen={isOpen.modules}
				onClick={handlers.handleCreateNode}
				onClose={onClose.modules}
				importModule={() => ctx.setMode?.('import')}
				createModule={handlers.handleCreateModule}
				editModule={handlers.handleEditModule}
				deleteModule={handlers.handleDeleteModule}
				modules={ctx.modules || []}
				visible={ctx.mode !== 'module'}
			/>
			<CodeDialog
				isOpen={ctx.codeOpen || false}
				onClose={() => ctx.setCodeOpen?.(false)}
				code={ctx.code || []}
			/>
			<FilePicker
				title='Open File'
				isOpen={ctx.mode === 'open'}
				onSelect={handlers.handleSelectFile(fileName)}
				onClose={() => ctx.setMode?.('chart')}
			/>
			<FilePicker
				title='Import Module'
				isOpen={ctx.mode === 'import'}
				onSelect={(fileName) => {
					ctx.setMode?.('chart');
					ctx.mod.load(fileName);
				}}
				onClose={() => ctx.setMode?.('chart')}
			/>
			<SaveDialog
				isOpen={ctx.mode === 'save'}
				name={ctx.chart.name}
				onSubmit={handlers.handleSave}
				onClose={() => ctx.setMode?.('chart')}
			/>
		</>
	);
};

export default Dialogs;
