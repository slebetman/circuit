import { useEffect, useState } from 'react';
import {
	EdgeLabelRenderer,
	getSmoothStepPath,
	EdgeProps,
	XYPosition,
} from 'reactflow';
import DragHandle from './DragHandle';
import { getCustomSmoothStepPath } from 'lib/customSmoothStepPath';

const DEBUG = false;
const defaultHandleOffset = 5;

type HandleOffset = {
	source: number;
	target: number;
};

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

	const [offset, setOffset] = useState<XYPosition>({
		x: data.offsetX || 0,
		y: data.offsetY || 0,
	});

	const [handleOffset, setHandleOffset] = useState<HandleOffset>({
		source: data.sourceOffset || 0,
		target: data.targetOffset || 0,
	});

	const [path, labelX, labelY] = getCustomSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: 3,
		sourceOffset: defaultHandleOffset + handleOffset.source,
		targetOffset: defaultHandleOffset + handleOffset.target,
		centerX: (sourceX + targetX) / 2 + offset.x,
		centerY: (sourceY + targetY) / 2 + offset.y,
	});

	useEffect(() => {
		data.offsetX = offset.x;
		data.offsetY = offset.y;
		data.sourceOffset = handleOffset.source;
		data.targetOffset = handleOffset.target;
	}, [offset, handleOffset]);

	return (
		<>
			<path
				style={style}
				stroke={
					data.on
						? '#6c6'
						: data.on === false
						? '#ccc'
						: selected
						? '#000'
						: '#ccc'
				}
				fill='transparent'
				d={path}
			/>
			{selected && data.on === undefined && (
				<EdgeLabelRenderer>
					<DragHandle
						char='◆'
						pos={{
							x:
								sourceX +
								handleOffset.source +
								defaultHandleOffset,
							y: sourceY,
						}}
						offset={{
							x: handleOffset.source,
							y: 0,
						}}
						onMove={(mouse, drag) => {
							setHandleOffset((o) => {
								const val = mouse.x - drag.x;
								return {
									source:
										val > -defaultHandleOffset
											? val
											: -defaultHandleOffset,
									target: o.target,
								};
							});
						}}
					/>
					<DragHandle
						pos={{ x: labelX, y: labelY }}
						offset={offset}
						onMove={(mouse, drag) => {
							setOffset((o) => ({
								x: mouse.x - drag.x,
								y: mouse.y - drag.y,
							}));
						}}
					/>
					<DragHandle
						char='◆'
						pos={{
							x:
								targetX -
								handleOffset.target -
								defaultHandleOffset,
							y: targetY,
						}}
						offset={{
							x: -handleOffset.target,
							y: 0,
						}}
						onMove={(mouse, drag) => {
							setHandleOffset((o) => {
								const val = drag.x - mouse.x;
								return {
									target:
										val > -defaultHandleOffset
											? val
											: -defaultHandleOffset,
									source: o.source,
								};
							});
						}}
					/>
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
