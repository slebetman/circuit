import Nor from 'components/Icons/Nor';
import { memo, FC } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';

const NorGate: FC<NodeProps> = ({ id, selected }) => {
	return (
		<>
			<Handle
				type='target'
				id='a'
				position={Position.Left}
				style={{ top: '6px' }}
			/>
			<Handle
				type='target'
				id='b'
				position={Position.Left}
				style={{ top: '15px' }}
			/>
			<Nor selected={selected} />
			<Handle
				type='source'
				id='c'
				position={Position.Right}
				style={{ top: '10px' }}
			/>
		</>
	);
};

export default memo(NorGate);
