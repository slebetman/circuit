import { getEditorContext } from 'lib/editorContext';
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

const InputNode: FC<NodeProps> = ({ data, id, selected }) => {
	const [editmode, setEditmode] = useState(false);
	const [label, setLabel] = useState(data.label);

	const ctx = getEditorContext();

	const handleEditMode = () => {
		if (!ctx.sim) {
			setEditmode(true);
		}
	};

	const handleEditInput = (e: FormEvent<HTMLInputElement>) => {
		setLabel(e.currentTarget.value);
	};

	useEffect(() => {
		data.label = label;
	}, [label]);

	return (
		<>
			{editmode ? (
				<div style={editStyle}>
					<input
						type='text'
						value={label}
						onChange={handleEditInput}
						onBlur={() => setEditmode(false)}
						style={inputStyle}
						size={label.length || 1}
					/>
					<button onClick={() => setEditmode(false)}>OK</button>
				</div>
			) : (
				<div
					onClick={(e) => {
						if (data.sim) {
							data.sim(!data.on);
							e.preventDefault();
							e.stopPropagation();
						}
					}}
					onDoubleClick={handleEditMode}
					style={{
						...nodeStyle,
						zIndex: '9999999',
						borderWidth: selected ? '2px' : '1px',
						marginLeft: selected ? '-2px' : '0px',
						backgroundColor: data.on
							? '#9f9'
							: data.on === false
							? '#aaa'
							: '#fff',
						cursor: ctx.sim ? 'pointer' : 'grab',
					}}
				>
					{label}
				</div>
			)}
			<Handle type='source' id='c' position={Position.Right} />
		</>
	);
};

export default memo(InputNode);
