import Box from 'components/Icons/Box';
import Popup from 'components/Popup/Popup';
import ToolButton from 'components/Panels/ToolButton';
import { Module } from 'hooks/useChart';
import { getEditorContext } from 'lib/editorContext';
import { ModulesList } from './ModulesDialog/ModulesList';

type ModulesDialogProps = {
	modules: Module[];
	onClick: (actionType: string) => void;
	onClose: () => void;
	createModule?: () => void;
	importModule?: () => void;
	editModule?: (type: string) => void;
	deleteModule?: (type: string) => void;
	visible?: boolean;
	isOpen: boolean;
};

const ModulesDialog = ({
	modules,
	onClick,
	onClose,
	isOpen,
	createModule,
	importModule,
	editModule,
	deleteModule,
	visible,
}: ModulesDialogProps) => {
	const ctx = getEditorContext();

	return (
		<Popup
			title='Modules'
			onClose={onClose}
			isOpen={isOpen}
			style={{
				width: 'fit-content',
				top: '16px',
				left: '80px',
				display: visible === false ? 'none' : 'block',
			}}
		>
			<div
				style={{
					padding: '2px',
					borderBottom: '1px solid #ccc',
					display: 'flex',
					justifyContent: 'end',
					gap: '2px',
				}}
			>
				<button onClick={createModule}>New</button>
				<button onClick={importModule}>Import</button>
			</div>
			<ModulesList
				modules={modules.filter((module) => {
					// Avoid recursively nested modules
					return !ctx.currentModule?.find(
						(m) => m.type === module.type,
					);
				})}
				onSelect={onClick}
				editModule={editModule}
				deleteModule={deleteModule}
			/>
		</Popup>
	);
};

export default ModulesDialog;
