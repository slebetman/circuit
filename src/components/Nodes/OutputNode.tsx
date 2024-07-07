import { memo, FC, useState, FormEvent, CSSProperties, useEffect } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

const labelFont: CSSProperties = {
	fontSize: '8px',
};

const inputStyle: CSSProperties = {
	...labelFont,
	paddingRight: '0',
	paddingLeft: '10px',
};

const nodeStyle: CSSProperties = {
	...labelFont,
	width: 'auto',
	border: '1px solid black',
	height: '20px',
	padding: '5px',
};

const editStyle: CSSProperties = {
	border: '1px solid #ccc',
	display: 'flex',
	flexDirection: 'row',
};

const OutputNode: FC<NodeProps> = ({ data, id, selected }) => {
	const [editmode, setEditmode] = useState(false);
	const [label, setLabel] = useState(data.label);

	const handleCommentClick = () => {
		setEditmode(true);
	};

	const handleCommentInput = (e: FormEvent<HTMLInputElement>) => {
		setLabel(e.currentTarget.value);
	};

	useEffect(() => {
		data.label = label;
	}, [label]);

	return (
		<>
			<Handle type='target' id='c' position={Position.Left} />
			{editmode ?
				<div style={editStyle}>
					<input
						type='text'
						value={label}
						onChange={handleCommentInput}
						onBlur={() => setEditmode(false)}
						style={inputStyle}
						size={label.length || 1}
					/>
					<button onClick={() => setEditmode(false)}>OK</button>
				</div>
			:	<div
					onDoubleClick={handleCommentClick}
					style={{
						...nodeStyle,
						borderWidth: selected ? '2px' : '1px',
						backgroundColor:
							data.on ? '#9f9'
							: data.on === false ? '#aaa'
							: '#fff',
					}}
				>
					{label}
				</div>
			}
		</>
	);
};

export default memo(OutputNode);
