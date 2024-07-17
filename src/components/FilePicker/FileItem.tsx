import File from 'components/Icons/File';
import Folder from 'components/Icons/Folder';
import { DirListing } from 'lib/fileLister';
import { FC, useState } from 'react';

type FileItemProps = {
	file: DirListing;
	onSelect: (file: DirListing) => void;
	key: string | number;
};

const FileItem: FC<FileItemProps> = ({ file, onSelect, key }) => {
	const [hover, setHover] = useState(false);

	return (
		<tr
			key={key}
			onClick={() => onSelect(file)}
			onPointerEnter={() => setHover(true)}
			onPointerLeave={() => setHover(false)}
			style={{
				color: hover ? '#000' : '#333',
				backgroundColor: hover ? '#ddd' : '#fff',
				userSelect: 'none',
				cursor: 'pointer',
			}}
		>
			<td>
				{file.type === 'file' ?
					<File />
				:	<Folder />}
			</td>
			<td
				style={{
					minWidth: '220px',
				}}
			>
				{file.name}
			</td>
		</tr>
	);
};

export default FileItem;
