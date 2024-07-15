import And from 'components/Icons/And';
import Comment from 'components/Icons/Comment';
import Nand from 'components/Icons/Nand';
import Nor from 'components/Icons/Nor';
import Not from 'components/Icons/Not';
import Or from 'components/Icons/Or';
import Xnor from 'components/Icons/Xnor';
import Xor from 'components/Icons/Xor';
import Popup from 'components/Popup/Popup';
import ToolButton from 'components/ToolPanel/ToolButton';

type NodesDialogProps = {
	onClick: (actionType: string) => void;
	onClose: () => void;
	isOpen: boolean;
};

const NodesDialog = ({ onClick, onClose, isOpen }: NodesDialogProps) => {
	return (
		<Popup
			title='Nodes'
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
					width: '158px',
					padding: '2px',
					display: 'flex',
					gap: '2px',
					flexWrap: 'wrap',
				}}
			>
				<ToolButton
					icon={And}
					onClick={onClick}
					actionType='and'
					title='And'
				/>
				<ToolButton
					icon={Nand}
					onClick={onClick}
					actionType='nand'
					title='Nand'
				/>
				<ToolButton
					icon={Not}
					onClick={onClick}
					actionType='not'
					title='Not'
				/>
				<ToolButton
					icon={Or}
					onClick={onClick}
					actionType='or'
					title='Or'
				/>
				<ToolButton
					icon={Nor}
					onClick={onClick}
					actionType='nor'
					title='Nor'
				/>
				<ToolButton
					icon={Xor}
					onClick={onClick}
					actionType='xor'
					title='Xor'
				/>
				<ToolButton
					label='Input'
					onClick={onClick}
					actionType='in'
					title='Input'
				/>
				<ToolButton
					label='Output'
					onClick={onClick}
					actionType='out'
					title='Output'
				/>
				<ToolButton
					icon={Comment}
					onClick={onClick}
					actionType='comment'
					title='Comment'
				/>
			</div>
		</Popup>
	);
};

export default NodesDialog;
