import { FC, useState } from 'react';
import ReactFlow, {
	Connection,
	ConnectionLineType,
	Controls,
	DefaultEdgeOptions,
	Edge,
	ReactFlowInstance,
	ReactFlowProps,
	ReactFlowProvider,
} from 'reactflow';

import nodeTypes from 'components/Nodes';
import { SimulatableEdge } from './SimulatableEdge';

const defaultEdgeOptions: DefaultEdgeOptions = {
	type: 'simulated',
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
			(e) => e.target === target && e.targetHandle === targetHandle,
		);
	};

const Flow: FC<FlowProps> = ({ editable, children, edges, ...props }) => {
	const [nodeHover, setNodeHover] = useState(false);

	return (
		<ReactFlowProvider>
			<ReactFlow
				onNodeMouseEnter={() => setNodeHover(true)}
				onNodeMouseLeave={() => setNodeHover(false)}
				nodeTypes={nodeTypes}
				defaultEdgeOptions={defaultEdgeOptions}
				connectionLineType={ConnectionLineType.SmoothStep}
				minZoom={0.1}
				maxZoom={10}
				edgeTypes={edgeTypes}
				panOnDrag={nodeHover ? [1] : true}
				zoomOnDoubleClick={false}
				nodesConnectable={editable}
				nodesDraggable={editable}
				edgesUpdatable={editable}
				edgesFocusable={editable}
				nodesFocusable={editable}
				elementsSelectable={editable}
				fitView
				isValidConnection={onlyOneConnectionPerInput(edges ?? [])}
				edges={edges}
				{...props}
			>
				{children}
				<Controls showInteractive={false} />
			</ReactFlow>
		</ReactFlowProvider>
	);
};

export default Flow;
