import { useEffect, useState } from 'react';
import {
	EdgeLabelRenderer,
	getSmoothStepPath,
	EdgeProps,
	useReactFlow,
	XYPosition,
} from 'reactflow';

const DEBUG = true;

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

	const [drag, setDrag] = useState<XYPosition|null>(null);
	const [offsetX, setOffsetX] = useState<number>(0);
	const [offsetY, setOffsetY] = useState<number>(0);

	const [path, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: 5,
		offset: 5,
		centerX: ((sourceX+targetX)/2)+offsetX,
		centerY: ((sourceY+targetY)/2)+offsetY,
	});

	useEffect(() => {
		data.offsetX = offsetX;
		data.offsetY = offsetY;
	},[offsetX])

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
			{selected && data.on === undefined &&
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
							const {x,y} = flow.project({
								x: e.clientX,
								y: e.clientY,
							});
							setDrag({
								x: x-offsetX,
								y: y-offsetY
							});
						}}
						onPointerUp={() => setDrag(null)}
						onPointerOut={() => setDrag(null)}
						onPointerMove={(e) => {
							if (drag !== null) {
								const {x,y} = flow.project({
									x: e.clientX,
									y: e.clientY,
								});
								setOffsetX(o => (x-drag.x));
								setOffsetY(o => (y-drag.y));
							}
						}}
						className='nodrag nopan'
					>
						⦿
					</div>
				</EdgeLabelRenderer>
			}
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
