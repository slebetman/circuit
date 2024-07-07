import { FC } from 'react';
import ReactFlow, {
	Connection,
	Edge,
	ConnectionLineType,
	Controls,
	DefaultEdgeOptions,
	Node,
	ReactFlowInstance,
	OnNodesChange,
	OnEdgesChange,
	ReactFlowProps,
} from 'reactflow';

import nodeTypes from 'components/Nodes';
import { CustomSmartBezierEdge } from './CustomSmartBezierEdge';
import { SimulatableEdge } from './SimulatableEdge';

const defaultEdgeOptions: DefaultEdgeOptions = {
	type: 'simulated',
	// type: "smoothstep",
	// type: "smart",
	data: {},
};

const edgeTypes = {
	smart: CustomSmartBezierEdge,
	simulated: SimulatableEdge,
};

type FlowProps = {
	nodes: Node[];
	edges: Edge[];
	onNodesChange: OnNodesChange;
	onEdgesChange: OnEdgesChange;
	onConnect: (p: Connection | Edge) => any;
	onInit: (instance: ReactFlowInstance) => void;
	editable: boolean;
} & ReactFlowProps;

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
			{...props}
		>
			{children}
			<Controls showInteractive={false} />
		</ReactFlow>
	);
};

export default Flow;
