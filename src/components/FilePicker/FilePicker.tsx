import useChartList from 'hooks/useChartList';
import { useEffect, useState } from 'react';
import { FileList } from './FileList';

type FilePickerProps = {
	onSelect: (file: string) => void;
};

const FilePicker = ({ onSelect }: FilePickerProps) => {
	const [dir, setDir] = useState<string[]>([]);
	const chartList = useChartList();

	useEffect(() => {
		chartList.load(dir.join('/'));
	}, [dir]);

	return (
		<div
			style={{
				maxHeight: '210px',
				overflow: 'hidden auto',
			}}
		>
			<FileList
				isRoot={dir.length === 0}
				files={chartList.files || []}
				onSelect={(f) => {
					if (f.type === 'file') {
						onSelect(f.name);
					}
				}}
			/>
		</div>
	);
};

export default FilePicker;
