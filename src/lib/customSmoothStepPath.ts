import { Position, XYPosition } from 'reactflow';

function getEdgeCenter({
	sourceX,
	sourceY,
	targetX,
	targetY,
}: {
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
}): [number, number, number, number] {
	const xOffset = Math.abs(targetX - sourceX) / 2;
	const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

	const yOffset = Math.abs(targetY - sourceY) / 2;
	const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

	return [centerX, centerY, xOffset, yOffset];
}

export interface GetSmoothStepPathParams {
	sourceX: number;
	sourceY: number;
	sourcePosition?: Position;
	targetX: number;
	targetY: number;
	targetPosition?: Position;
	borderRadius?: number;
	centerX?: number;
	centerY?: number;
	sourceOffset?: number;
	targetOffset?: number;
}

const handleDirections = {
	[Position.Left]: { x: -1, y: 0 },
	[Position.Right]: { x: 1, y: 0 },
	[Position.Top]: { x: 0, y: -1 },
	[Position.Bottom]: { x: 0, y: 1 },
};

const getDirection = ({
	source,
	sourcePosition = Position.Bottom,
	target,
}: {
	source: XYPosition;
	sourcePosition: Position;
	target: XYPosition;
}): XYPosition => {
	if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
		return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
	}
	return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};

const distance = (a: XYPosition, b: XYPosition) =>
	Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

// ith this function we try to mimic a orthogonal edge routing behaviour
// It's not as good as a real orthogonal edge routing but it's faster and
//  good enough as a default for step and smooth step edges
function getPoints({
	source,
	sourcePosition = Position.Bottom,
	target,
	targetPosition = Position.Top,
	center,
	sourceOffset,
	targetOffset,
}: {
	source: XYPosition;
	sourcePosition: Position;
	target: XYPosition;
	targetPosition: Position;
	center: Partial<XYPosition>;
	sourceOffset: number;
	targetOffset: number;
}): [XYPosition[], number, number, number, number] {
	const sourceDir = handleDirections[sourcePosition];
	const targetDir = handleDirections[targetPosition];
	const sourceGapped: XYPosition = {
		x: source.x + sourceDir.x * sourceOffset,
		y: source.y + sourceDir.y * sourceOffset,
	};
	const targetGapped: XYPosition = {
		x: target.x + targetDir.x * targetOffset,
		y: target.y + targetDir.y * targetOffset,
	};
	const dir = getDirection({
		source: sourceGapped,
		sourcePosition,
		target: targetGapped,
	});
	const dirAccessor = dir.x !== 0 ? 'x' : 'y';
	const currDir = dir[dirAccessor];

	let points: XYPosition[] = [];
	let centerX = 0,
		centerY = 0;
	const sourceGapOffset = { x: 0, y: 0 };
	const targetGapOffset = { x: 0, y: 0 };

	const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] =
		getEdgeCenter({
			sourceX: source.x,
			sourceY: source.y,
			targetX: target.x,
			targetY: target.y,
		});

	// opposite handle positions, default case
	if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
		centerX = center.x ?? defaultCenterX;
		centerY = center.y ?? defaultCenterY;

		const verticalSplit: XYPosition[] = [];

		if (source.y < target.y) {
			if (centerY < sourceGapped.y) {
				//   ----
				//   |  |
				// ---  |
				//      |
				//      ---
				verticalSplit.push({ x: sourceGapped.x, y: centerY });
				verticalSplit.push({ x: centerX, y: centerY });
				verticalSplit.push({ x: centerX, y: targetGapped.y });
			} else if (centerY > targetGapped.y) {
				// ---
				//   |
				//   |  ---
				//   |  |
				//   ----
				verticalSplit.push({ x: centerX, y: sourceGapped.y });
				verticalSplit.push({ x: centerX, y: centerY });
				verticalSplit.push({ x: targetGapped.x, y: centerY });
			} else {
				// ---
				//   |
				//   ---
				verticalSplit.push({ x: centerX, y: sourceGapped.y });
				verticalSplit.push({ x: centerX, y: targetGapped.y });
			}
		} else {
			if (centerY > sourceGapped.y) {
				//      ---
				//      |
				// ---  |
				//   |  |
				//   ----
				verticalSplit.push({ x: sourceGapped.x, y: centerY });
				verticalSplit.push({ x: centerX, y: centerY });
				verticalSplit.push({ x: centerX, y: targetGapped.y });
			} else if (centerY < targetGapped.y) {
				//   ----
				//   |  |
				//   |  ---
				//   |
				// ---
				verticalSplit.push({ x: centerX, y: sourceGapped.y });
				verticalSplit.push({ x: centerX, y: centerY });
				verticalSplit.push({ x: targetGapped.x, y: centerY });
			} else {
				//   ---
				//   |
				// ---
				verticalSplit.push({ x: centerX, y: sourceGapped.y });
				verticalSplit.push({ x: centerX, y: targetGapped.y });
			}
		}

		const horizontalSplit: XYPosition[] = [];

		if (centerX > sourceGapped.x) {
			//      --
			//       |
			//  ------
			//  |
			horizontalSplit.push({ x: centerX, y: sourceGapped.y });
			horizontalSplit.push({ x: centerX, y: centerY });
			horizontalSplit.push({ x: targetGapped.x, y: centerY });
		} else if (centerX < targetGapped.x) {
			//       |
			//  ------
			//  |
			//  --
			horizontalSplit.push({ x: sourceGapped.x, y: centerY });
			horizontalSplit.push({ x: centerX, y: centerY });
			horizontalSplit.push({ x: centerX, y: targetGapped.y });
		} else {
			//    |
			//  ---
			//  |
			horizontalSplit.push({ x: sourceGapped.x, y: centerY });
			horizontalSplit.push({ x: targetGapped.x, y: centerY });
		}

		if (sourceDir[dirAccessor] === currDir) {
			points =
				(
					dirAccessor === 'x' &&
					centerX <= targetGapped.x &&
					centerX >= sourceGapped.x
				) ?
					verticalSplit
				:	horizontalSplit;
		} else {
			points = dirAccessor === 'x' ? horizontalSplit : verticalSplit;
		}
	} else {
		// // sourceTarget means we take x from source and y from target, targetSource is the opposite
		// const sourceTarget: XYPosition[] = [
		// 	{ x: sourceGapped.x, y: targetGapped.y },
		// ];
		// const targetSource: XYPosition[] = [
		// 	{ x: targetGapped.x, y: sourceGapped.y },
		// ];
		// // this handles edges with same handle positions
		// if (dirAccessor === 'x') {
		// 	points = sourceDir.x === currDir ? targetSource : sourceTarget;
		// } else {
		// 	points = sourceDir.y === currDir ? sourceTarget : targetSource;
		// }
		// if (sourcePosition === targetPosition) {
		// 	const diff = Math.abs(source[dirAccessor] - target[dirAccessor]);
		// 	// if an edge goes from right to right for example (sourcePosition === targetPosition) and
		// 	// the distance between source.x and target.x is less than the offset, the added point and
		// 	// the gapped source/target will overlap. This leads to a weird edge path. To avoid this we add
		// 	// a gapOffset to the source/target
		// 	if (diff <= sourceOffset || diff < targetOffset) {
		// 		if (sourceDir[dirAccessor] === currDir) {
		// 			sourceGapOffset[dirAccessor] =
		// 				(sourceGapped[dirAccessor] > source[dirAccessor] ?
		// 					-1
		// 				:	1) * Math.min(sourceOffset - 1, sourceOffset - diff);
		// 		} else {
		// 			targetGapOffset[dirAccessor] =
		// 				(targetGapped[dirAccessor] > target[dirAccessor] ?
		// 					-1
		// 				:	1) * Math.min(targetOffset - 1, targetOffset - diff);
		// 		}
		// 	}
		// }
		// // these are conditions for handling mixed handle positions like Right -> Bottom for example
		// if (sourcePosition !== targetPosition) {
		// 	const dirAccessorOpposite = dirAccessor === 'x' ? 'y' : 'x';
		// 	const isSameDir =
		// 		sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
		// 	const sourceGtTargetOppo =
		// 		sourceGapped[dirAccessorOpposite] >
		// 		targetGapped[dirAccessorOpposite];
		// 	const sourceLtTargetOppo =
		// 		sourceGapped[dirAccessorOpposite] <
		// 		targetGapped[dirAccessorOpposite];
		// 	const flipSourceTarget =
		// 		(sourceDir[dirAccessor] === 1 &&
		// 			((!isSameDir && sourceGtTargetOppo) ||
		// 				(isSameDir && sourceLtTargetOppo))) ||
		// 		(sourceDir[dirAccessor] !== 1 &&
		// 			((!isSameDir && sourceLtTargetOppo) ||
		// 				(isSameDir && sourceGtTargetOppo)));
		// 	if (flipSourceTarget) {
		// 		points = dirAccessor === 'x' ? sourceTarget : targetSource;
		// 	}
		// }
		// const sourceGapPoint = {
		// 	x: sourceGapped.x + sourceGapOffset.x,
		// 	y: sourceGapped.y + sourceGapOffset.y,
		// };
		// const targetGapPoint = {
		// 	x: targetGapped.x + targetGapOffset.x,
		// 	y: targetGapped.y + targetGapOffset.y,
		// };
		// const maxXDistance = Math.max(
		// 	Math.abs(sourceGapPoint.x - points[0].x),
		// 	Math.abs(targetGapPoint.x - points[0].x),
		// );
		// const maxYDistance = Math.max(
		// 	Math.abs(sourceGapPoint.y - points[0].y),
		// 	Math.abs(targetGapPoint.y - points[0].y),
		// );
		// // we want to place the label on the longest segment of the edge
		// if (maxXDistance >= maxYDistance) {
		// 	centerX = (sourceGapPoint.x + targetGapPoint.x) / 2;
		// 	centerY = points[0].y;
		// } else {
		// 	centerX = points[0].x;
		// 	centerY = (sourceGapPoint.y + targetGapPoint.y) / 2;
		// }
	}

	const pathPoints = [
		source,
		{
			x: sourceGapped.x + sourceGapOffset.x,
			y: sourceGapped.y + sourceGapOffset.y,
		},
		...points,
		{
			x: targetGapped.x + targetGapOffset.x,
			y: targetGapped.y + targetGapOffset.y,
		},
		target,
	];

	return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}

function getBend(
	a: XYPosition,
	b: XYPosition,
	c: XYPosition,
	size: number,
): string {
	const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
	const { x, y } = b;

	// no bend
	if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
		return `L${x} ${y}`;
	}

	// first segment is horizontal
	if (a.y === y) {
		const xDir = a.x < c.x ? -1 : 1;
		const yDir = a.y < c.y ? 1 : -1;
		return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${
			y + bendSize * yDir
		}`;
	}

	const xDir = a.x < c.x ? 1 : -1;
	const yDir = a.y < c.y ? -1 : 1;
	return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${
		x + bendSize * xDir
	},${y}`;
}

/**
 * Get a smooth step path from source to target handle
 * @param params.sourceX - The x position of the source handle
 * @param params.sourceY - The y position of the source handle
 * @param params.sourcePosition - The position of the source handle (default: Position.Bottom)
 * @param params.targetX - The x position of the target handle
 * @param params.targetY - The y position of the target handle
 * @param params.targetPosition - The position of the target handle (default: Position.Top)
 * @returns A path string you can use in an SVG, the labelX and labelY position (center of path) and offsetX, offsetY between source handle and label
 * @example
 *  const source = { x: 0, y: 20 };
    const target = { x: 150, y: 100 };
    
    const [path, labelX, labelY, offsetX, offsetY] = getSmoothStepPath({
      sourceX: source.x,
      sourceY: source.y,
      sourcePosition: Position.Right,
      targetX: target.x,
      targetY: target.y,
      targetPosition: Position.Left,
    });
 */
export function getCustomSmoothStepPath({
	sourceX,
	sourceY,
	sourcePosition = Position.Bottom,
	targetX,
	targetY,
	targetPosition = Position.Top,
	borderRadius = 5,
	centerX,
	centerY,
	sourceOffset = 20,
	targetOffset = 20,
}: GetSmoothStepPathParams): [
	path: string,
	labelX: number,
	labelY: number,
	offsetX: number,
	offsetY: number,
] {
	const [points, labelX, labelY, offsetX, offsetY] = getPoints({
		source: { x: sourceX, y: sourceY },
		sourcePosition,
		target: { x: targetX, y: targetY },
		targetPosition,
		center: { x: centerX, y: centerY },
		sourceOffset,
		targetOffset,
	});

	const path = points.reduce<string>((res, p, i) => {
		let segment = '';

		if (i > 0 && i < points.length - 1) {
			segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
		} else {
			segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
		}

		res += segment;

		return res;
	}, '');

	return [path, labelX, labelY, offsetX, offsetY];
}
