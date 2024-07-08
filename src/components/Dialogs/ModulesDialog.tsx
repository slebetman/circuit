import Popup from 'components/Popup/Popup';
import ToolButton from 'components/ToolPanel/ToolButton';
import { getChartRef } from 'lib/chartRefs';

type ModulesDialogProps = {
	onClick: (actionType: string) => void;
	onClose: () => void;
	isOpen: boolean;
};

const ModulesDialog = ({ onClick, onClose, isOpen }: ModulesDialogProps) => {
	const chartRef = getChartRef();

	return (
		<Popup
			title='Modules'
			onClose={onClose}
			isOpen={isOpen}
			style={{
				width: 'fit-content',
				top: '16px',
				left: '80px',
			}}
		>
			<div
				style={{
					padding: '2px',
					borderBottom: '1px solid #ccc',
					display: 'flex',
					justifyContent: 'end',
				}}
			>
				<button>+ New</button>
			</div>
			<div
				style={{
					padding: '2px',
					display: 'flex',
					gap: '2px',
					flexDirection: 'column',
				}}
			>
				{chartRef?.modules?.map((module) => (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							gap: '2px',
						}}
					>
						<ToolButton
							label={module.label}
							onClick={onClick}
							actionType={module.type}
							style={{
								width: '80px',
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
							<button>Edit</button>
							<button>Delete</button>
						</div>
					</div>
				))}
			</div>
		</Popup>
	);
};

export default ModulesDialog;
