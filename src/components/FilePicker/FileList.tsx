import { DirListing } from 'lib/fileLister';
import { FC } from 'react';
import FileItem from './FileItem';

type FileListProps = {
	files: DirListing[];
	onSelect: (file: DirListing) => void;
	isRoot: boolean;
};

export const FileList: FC<FileListProps> = ({ files, onSelect, isRoot }) => {
	return (
		<table
			style={{
				width: 'calc(100% - 20px)',
				margin: '10px',
				borderCollapse: 'collapse',
			}}
		>
			<tbody>
				{!isRoot && (
					<FileItem
						key='root'
						file={{ name: '..', type: 'dir' }}
						onSelect={onSelect}
					/>
				)}
				{files?.map((f, i) => (
					<FileItem key={i} file={f} onSelect={onSelect} />
				))}
			</tbody>
		</table>
	);
};
