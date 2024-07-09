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
				left: 'calc(50% - 400px)',
			}}
		>
			<div
				style={{
					minHeight: '300px',
					maxHeight: 'calc(100vh - 200px)',
					overflow: 'auto',
				}}
			>
				{code.map((c, i) => (
					<pre
						key={`i${i}`}
						style={{
							whiteSpace: 'pre-wrap',
							padding: '0px 5px 10px 45px',
							fontSize: '14px',
							textIndent: '-40px',
						}}
					>
						{c}
					</pre>
				))}
			</div>
		</Popup>
	);
};

export default CodeDialog;
