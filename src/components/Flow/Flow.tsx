import { FC } from 'react';
import ReactFlow, {
	Connection,
	ConnectionLineType,
	Controls,
	DefaultEdgeOptions,
	Edge,
	ReactFlowInstance,
	ReactFlowProps,
} from 'reactflow';

import nodeTypes from 'components/Nodes';
import { SimulatableEdge } from './SimulatableEdge';

const defaultEdgeOptions: DefaultEdgeOptions = {
	type: 'simulated',
	// type: "smoothstep",
	// type: "smart",
	data: {},
};

const edgeTypes = {
	simulated: SimulatableEdge,
};

type FlowProps = ReactFlowProps & {
	onInit: (instance: ReactFlowInstance) => void;
	editable: boolean;
};

const onlyOneConnectionPerInput =
	(edges: Edge[]) => (connection: Connection) => {
		const target = connection.target;
		const targetHandle = connection.targetHandle;

		return !edges?.find(
			(e) => e.target === target && e.targetHandle === targetHandle
		);
	};

const Flow: FC<FlowProps> = ({ editable, children, ...props }) => {
	return (
		<ReactFlow
			nodeTypes={nodeTypes}
			defaultEdgeOptions={defaultEdgeOptions}
			connectionLineType={ConnectionLineType.SmoothStep}
			minZoom={0.1}
			maxZoom={10}
			edgeTypes={edgeTypes}
			zoomOnDoubleClick={editable}
			nodesConnectable={editable}
			nodesDraggable={editable}
			edgesUpdatable={editable}
			fitView
			isValidConnection={onlyOneConnectionPerInput(props.edges || [])}
			{...props}
		>
			{children}
			<Controls showInteractive={false} />
		</ReactFlow>
	);
};

export default Flow;
