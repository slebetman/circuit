import Popup from 'components/Popup/Popup';
import { useEffect, useState } from 'react';

type SaveDialogProps = {
	onSubmit: (file: string) => void;
	onClose: () => void;
	name: string;
	isOpen: boolean;
};

const SaveDialog = ({ name, onSubmit, onClose, isOpen }: SaveDialogProps) => {
	const [fileName, setFileName] = useState(name);

	useEffect(() => {
		setFileName(name);
	}, [name]);

	return (
		<Popup title='Save File' onClose={onClose} isOpen={isOpen}>
			<div
				style={{
					padding: '20px',
					display: 'flex',
					gap: '10px',
				}}
			>
				<input
					type='text'
					style={{
						width: '300px',
					}}
					value={fileName}
					onChange={(e) => {
						setFileName(e.currentTarget.value);
					}}
				/>
				<button onClick={() => onSubmit(fileName)}>Save</button>
			</div>
		</Popup>
	);
};

export default SaveDialog;
