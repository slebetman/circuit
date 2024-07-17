import File from 'components/Icons/File';
import Folder from 'components/Icons/Folder';
import { DirListing } from 'lib/fileLister';
import { FC } from 'react';

type FileListProps = {
	files: DirListing[];
	onSelect: (file: DirListing) => void;
};

export const FileList: FC<FileListProps> = ({ files, onSelect }) => {
	return (
		<table
			style={{
				width: '100%',
				margin: '10px',
			}}
		>
			<tbody>
				{files?.map((f, i) => (
					<tr key={i}>
						<td>
							{f.type === 'file' ?
								<File />
							:	<Folder />}
						</td>
						<td
							style={{
								minWidth: '220px',
							}}
						>
							{`${f.name}${f.type === 'dir' ? '/' : ''}`}
						</td>
						<td>
							<button
								onClick={() => onSelect(f)}
							>
								Open
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
