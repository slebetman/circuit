import { FC, useEffect, useState } from 'react';
import { EdgeLabelRenderer, EdgeProps, XYPosition } from 'reactflow';
import DragHandle from './DragHandle';
import { getCustomSmoothStepPath } from 'lib/customSmoothStepPath';
import { getEditorContext } from 'lib/editorContext';

const DEBUG = false;
const defaultHandleOffset = 5;

type HandleOffset = {
	source: number;
	target: number;
};

export type SimulatableEdgeData = {
	offsetX: number;
	offsetY: number;
	sourceOffset: number;
	targetOffset: number;
	on?: boolean;
};

export const SimulatableEdge: FC<EdgeProps<SimulatableEdgeData>> = ({
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
}) => {
	const [offset, setOffset] = useState<XYPosition>({
		x: data?.offsetX || 0,
		y: data?.offsetY || 0,
	});

	const [handleOffset, setHandleOffset] = useState<HandleOffset>({
		source: data?.sourceOffset || 0,
		target: data?.targetOffset || 0,
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

	const ctx = getEditorContext();

	const checkMidHandle = (mid: XYPosition, midOffset: XYPosition) => {
		const shX = sourceX + defaultHandleOffset + handleOffset.source;
		const thX = targetX - defaultHandleOffset - handleOffset.target;

		let x = mid.x;

		if (mid.x > thX && mid.x > shX) {
			x = Math.max(thX, shX);
		} else if (mid.x < thX && mid.x < shX) {
			x = Math.min(thX, shX);
		}

		return {
			x: midOffset.x + (x - mid.x),
			y: midOffset.y,
		} as XYPosition;
	};

	const midHandleLineY = () => {
		let y = 0;
		if (labelY < sourceY && labelY < targetY) {
			y = Math.min(sourceY, targetY);
		} else if (labelY > sourceY && labelY > targetY) {
			y = Math.max(sourceY, targetY);
		} else {
			y = (sourceY + targetY) / 2;
		}
		return y;
	};

	const drawMidHandleLine = () => {
		return (
			drawDragHandles() &&
			labelX >= sourceX + handleOffset.source + defaultHandleOffset - 1 &&
			labelX <= targetX - handleOffset.target - defaultHandleOffset + 1
		);
	};

	const drawDragHandles = () => {
		return selected && data?.on === undefined;
	};

	useEffect(() => {
		if (data) {
			data.offsetX = offset.x;
			data.offsetY = offset.y;
			data.sourceOffset = handleOffset.source;
			data.targetOffset = handleOffset.target;
		}
	}, [offset, handleOffset]);

	return (
		<>
			{drawMidHandleLine() && (
				<line
					x1={labelX}
					x2={labelX}
					y1={labelY}
					y2={midHandleLineY()}
					stroke='#999'
					strokeDasharray={2}
				/>
			)}
			<path
				style={style}
				stroke={
					data?.on ? '#6c6'
					: data?.on === false ?
						'#ccc'
					: selected ?
						'#000'
					:	'#ccc'
				}
				fill='transparent'
				d={path}
			/>
			{drawDragHandles() && (
				<EdgeLabelRenderer>
					<DragHandle
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
							let val = Math.max(
								mouse.x - drag.x,
								-defaultHandleOffset,
							);
							setHandleOffset((o) => {
								return {
									source: val,
									target: o.target,
								};
							});
							setOffset((o) =>
								checkMidHandle(
									{
										x: (sourceX + targetX) / 2 + offset.x,
										y: labelY,
									},
									o,
								),
							);
						}}
					/>
					<DragHandle
						pos={{ x: labelX, y: labelY }}
						offset={offset}
						onMove={(mouse, drag) => {
							const midOffset = {
								x: mouse.x - drag.x,
								y: mouse.y - drag.y,
							};
							setOffset((o) =>
								checkMidHandle(
									{
										x:
											(sourceX + targetX) / 2 +
											midOffset.x,
										y: midOffset.y,
									},
									midOffset,
								),
							);
						}}
					/>
					<DragHandle
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
							const val = Math.max(
								drag.x - mouse.x,
								-defaultHandleOffset,
							);
							setHandleOffset((o) => {
								return {
									target: val,
									source: o.source,
								};
							});
							setOffset((o) =>
								checkMidHandle(
									{
										x: (sourceX + targetX) / 2 + offset.x,
										y: labelY,
									},
									o,
								),
							);
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
						<span>
							{ctx.currentModule ?
								`${ctx.currentModule.id}_`
							:	''}
							{id}
						</span>
					</div>
				</EdgeLabelRenderer>
			)}
		</>
	);
};
