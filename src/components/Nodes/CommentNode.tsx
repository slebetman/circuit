import { memo, FC, useState, FormEvent, CSSProperties, useEffect } from 'react';
import { NodeProps } from 'reactflow';

const commentFont: CSSProperties = {
	fontFamily: 'monospace',
	fontSize: '10px',
	fontStyle: 'italic',
	whiteSpace: 'pre-wrap',
};

const textStyle: CSSProperties = {
	...commentFont,
	width: '20rem',
	height: '5rem',
};

const nodeStyle: CSSProperties = {
	...commentFont,
	border: '1px solid #ffa',
	backgroundColor: '#ffa',
	padding: '2px 5px',
};

const editStyle: CSSProperties = {
	border: '1px solid #ccc',
	display: 'flex',
	flexDirection: 'column',
};

const CommentNode: FC<NodeProps> = ({ data, id, selected }) => {
	const [editmode, setEditmode] = useState(false);
	const [comment, setComment] = useState(data.label);

	const handleDoubleClick = () => {
		setEditmode(true);
	};

	const handleCommentInput = (e: FormEvent<HTMLTextAreaElement>) => {
		setComment(e.currentTarget.value);
	};

	useEffect(() => {
		data.label = comment;
	}, [comment]);

	return (
		<>
			{editmode ?
				<div style={editStyle}>
					<textarea
						value={comment}
						onChange={handleCommentInput}
						onBlur={() => setEditmode(false)}
						style={textStyle}
					/>
					<button onClick={() => setEditmode(false)}>OK</button>
				</div>
			:	<div
					onDoubleClick={handleDoubleClick}
					style={{
						...nodeStyle,
						borderColor: selected ? '#000' : '#ffa',
					}}
				>
					{comment}
				</div>
			}
		</>
	);
};

export default memo(CommentNode);
