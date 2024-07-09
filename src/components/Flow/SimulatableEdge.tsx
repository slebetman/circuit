import {
	EdgeLabelRenderer,
	getSmoothStepPath,
	SmoothStepEdgeProps,
} from 'reactflow';

const DEBUG = false;

export function SimulatableEdge(props: SmoothStepEdgeProps) {
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

	const [path, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: 5,
		offset: 5,
	});

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
			{DEBUG && (
				<EdgeLabelRenderer>
					<div
						style={{
							position: 'absolute',
							transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
							fontSize: 4,
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
