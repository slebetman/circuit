import Popup from 'components/Popup/Popup';
import useChartList from 'hooks/useChartList';
import { useEffect } from 'react';
import FilePicker from 'components/FilePicker/FilePicker';

type OpenDialogProps = {
	title: string;
	onSelect: (file: string) => void;
	onClose: () => void;
	isOpen: boolean;
};

const OpenDialog = ({ title, onSelect, onClose, isOpen }: OpenDialogProps) => {
	const chartList = useChartList();

	useEffect(() => {
		chartList.load();
	}, []);

	return (
		<Popup title={title} onClose={onClose} isOpen={isOpen}>
			<FilePicker onSelect={onSelect} />
		</Popup>
	);
};

export default OpenDialog;
