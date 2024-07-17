import Popup from 'components/Popup/Popup';
import useChartList from 'hooks/useChartList';
import { useEffect } from 'react';
import { FileList } from './FilePicker/FileList';

type FilePickerProps = {
	title: string;
	onSelect: (file: string) => void;
	onClose: () => void;
	isOpen: boolean;
};

const FilePicker = ({ title, onSelect, onClose, isOpen }: FilePickerProps) => {
	const chartList = useChartList();

	useEffect(() => {
		chartList.load();
	}, []);

	return (
		<Popup title={title} onClose={onClose} isOpen={isOpen}>
			<div
				style={{
					maxHeight: '210px',
					overflow: 'hidden auto',
				}}
			>
				<FileList
					files={chartList.files || []}
					onSelect={(f) => {
						if (f.type === 'file') {
							onSelect(f.name);
						}
					}}
				/>
			</div>
		</Popup>
	);
};

export default FilePicker;
