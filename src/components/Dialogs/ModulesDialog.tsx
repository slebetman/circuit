import Box from 'components/Icons/Box';
import Popup from 'components/Popup/Popup';
import ToolButton from 'components/ToolPanel/ToolButton';
import { Module } from 'hooks/useChart';
import { getChartRef } from 'lib/chartRefs';

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
			<div
				style={{
					padding: '2px',
					display: 'flex',
					gap: '2px',
					flexDirection: 'column',
				}}
			>
				{modules?.map((module, idx) => (
					<div
						key={`${module.type}${idx}`}
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '2px',
						}}
					>
						<ToolButton
							icon={Box}
							label={module.label}
							onClick={onClick}
							actionType={`module:${module.label}:${module.type}`}
							style={{
								height: '60px',
								width: '100px',
							}}
						/>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: '4px',
								justifyContent: 'center',
							}}
						>
							<button onClick={() => editModule?.(module.type)}>
								Edit
							</button>
							<button onClick={() => deleteModule?.(module.type)}>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</Popup>
	);
};

export default ModulesDialog;
