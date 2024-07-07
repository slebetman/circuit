import { FC } from 'react';

type ErrorDialogProps = {
	onClose: Function;
	isOpen: boolean;
	error: string;
};

const ErrorDialog: FC<ErrorDialogProps> = ({ onClose, isOpen, error }) =>
	isOpen ?
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
					padding: '10px',
					backgroundColor: '#f66',
				}}
			>
				Error: {error} &nbsp;
				<button onClick={() => onClose()}>x</button>
			</span>
		</div>
	:	null;

export default ErrorDialog;
