import { useEffect, useState } from 'react';
import {
	EdgeLabelRenderer,
	getSmoothStepPath,
	EdgeProps,
	useReactFlow,
	XYPosition,
} from 'reactflow';

const DEBUG = false;

export function SimulatableEdge(props: EdgeProps) {
	const {
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		style,
		data,
		selected,
		id,
	} = props;

	const flow = useReactFlow();

	const [drag, setDrag] = useState<XYPosition | null>(null);
	const [offset, setOffset] = useState<XYPosition>({
		x: data.offsetX || 0,
		y: data.offsetY || 0,
	});

	const [path, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: 3,
		offset: 5,
		centerX: (sourceX + targetX) / 2 + offset.x,
		centerY: (sourceY + targetY) / 2 + offset.y,
	});

	useEffect(() => {
		data.offsetX = offset.x;
		data.offsetY = offset.y;
	}, [offset]);

	return (
		<>
			<path
				style={style}
				stroke={
					data.on ? '#6c6'
					: data.on === false ?
						'#ccc'
					: selected ?
						'#000'
					:	'#ccc'
				}
				fill='transparent'
				d={path}
			/>
			{selected && data.on === undefined && (
				<EdgeLabelRenderer>
					<div
						style={{
							position: 'absolute',
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							pointerEvents: 'all',
							fontSize: '12px',
							zIndex: '9999999',
						}}
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
								setOffset((o) => ({
									x: x - drag.x,
									y: y - drag.y,
								}));
							}
						}}
						className='nodrag nopan'
					>
						⦿
					</div>
				</EdgeLabelRenderer>
			)}
			{DEBUG && (
				<EdgeLabelRenderer>
					<div
						style={{
							position: 'absolute',
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							fontSize: 3,
						}}
						className='nodrag nopan'
					>
						<span>{id}</span>
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
}
