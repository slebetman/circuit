import Popup from 'components/Popup/Popup';

type CodeDialogProps = {
	onClose: () => void;
	isOpen: boolean;
	code: string[];
};

const CodeDialog = ({ code, onClose, isOpen }: CodeDialogProps) => {
	return (
		<Popup
			title='Compiled Expressions'
			onClose={onClose}
			isOpen={isOpen}
			style={{
				width: '800px',
				minHeight: '300px',
				left: 'calc(50% - 400px)',
				overflow: 'auto',
			}}
		>
			<pre
				style={{
					whiteSpace: 'pre-wrap',
					padding: '5px 10px',
					fontSize: '14px',
				}}
			>
				{code.join('\n\n')}
			</pre>
		</Popup>
	);
};

export default CodeDialog;
