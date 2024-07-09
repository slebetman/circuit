import { FC } from 'react';

type ErrorDialogProps = {
	onClose: Function;
	isOpen: boolean;
	error: string;
};

const ErrorDialog: FC<ErrorDialogProps> = ({ onClose, isOpen, error }) =>
	isOpen ? (
		<div
			style={{
				position: 'absolute',
				top: '45vh',
				textAlign: 'center',
				width: '100%',
				zIndex: '9999999',
			}}
		>
			<span
				style={{
					padding: '20px',
					borderRadius: '10px',
					border: '1px solid #c00',
					backgroundColor: '#f66',
					boxShadow: '3px 3px 15px #00000066',
				}}
			>
				Error: {error} &nbsp;&nbsp;
				<button onClick={() => onClose()}>OK</button>
			</span>
		</div>
	) : null;

export default ErrorDialog;
