import { useNodes, BezierEdge, BezierEdgeProps } from 'reactflow'
import { getSmartEdge, pathfindingAStarNoDiagonal, pathfindingJumpPointNoDiagonal, svgDrawSmoothLinePath } from '@tisoap/react-flow-smart-edge'

export function CustomSmartBezierEdge(props:BezierEdgeProps) {
	const {
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		style,
		markerStart,
		markerEnd
	} = props

	const nodes = useNodes()

	const getSmartEdgeResponse = getSmartEdge({
		sourcePosition,
		targetPosition,
		sourceX,
		sourceY,
		targetX,
		targetY,
		nodes,
		options: {
			gridRatio: 5,
			nodePadding: 10,
			drawEdge: svgDrawSmoothLinePath,
			generatePath: pathfindingJumpPointNoDiagonal,
		}
	})

	if (getSmartEdgeResponse === null) {
		return <BezierEdge {...props} />
	}

	const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse

	return (
		<path
			style={style}
			className='react-flow__edge-path'
			d={svgPathString}
			markerEnd={markerEnd}
			markerStart={markerStart}
		/>
	)
}