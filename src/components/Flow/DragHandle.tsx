import { CSSProperties, FC, useState } from 'react';
import { useReactFlow, XYPosition } from 'reactflow';

export type DragHandleProps = {
	pos: XYPosition;
	debugBorderColor?: string;
	offset: XYPosition;
	char?: string | JSX.Element;
	onMove: (mousePos: XYPosition, dragPos: XYPosition) => void;
};

const DragHandle: FC<DragHandleProps> = ({
	pos,
	debugBorderColor,
	offset,
	char,
	onMove,
}) => {
	const [drag, setDrag] = useState<XYPosition | null>(null);

	const flow = useReactFlow();

	const style: CSSProperties = {
		position: 'absolute',
		transform: `translate(-50%, -50%) translate(${pos.x}px,${pos.y}px)`,
		pointerEvents: 'all',
		fontSize: '12px',
		padding: drag ? '100px' : 0,
		borderRadius: drag ? '200px' : 0,
		zIndex: '9999999',
	};

	if (debugBorderColor) {
		style.border = `1px solid ${debugBorderColor}`;
	}

	return (
		<div
			style={style}
			onPointerDown={(e) => {
				const { x, y } = flow.project({
					x: e.clientX,
					y: e.clientY,
				});
				setDrag({
					x: x - offset.x,
					y: y - offset.y,
				});
			}}
			onPointerUp={() => setDrag(null)}
			onPointerOut={() => setDrag(null)}
			onPointerMove={(e) => {
				if (drag !== null) {
					const { x, y } = flow.project({
						x: e.clientX,
						y: e.clientY,
					});
					onMove({ x, y }, drag);
				}
			}}
			className='nodrag nopan'
		>
			{char || '⦿'}
		</div>
	);
};

export default DragHandle;
