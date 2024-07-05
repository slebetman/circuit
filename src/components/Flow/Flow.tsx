import { FC } from "react";
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
} from "reactflow";
import { SmartBezierEdge } from "@tisoap/react-flow-smart-edge";

import nodeTypes from "components/Nodes";
import { CustomSmartBezierEdge } from "./CustomSmartBezierEdge";
import ToolPanel from "components/ToolPanel/ToolPanel";

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  // type: "smart"
};

const edgeTypes = {
  smart: CustomSmartBezierEdge,
};

type FlowProps = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (p: Connection | Edge) => any;
  onInit: (instance: ReactFlowInstance) => void;
} & ReactFlowProps;

const Flow: FC<FlowProps> = ({
  onInit,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodes,
  edges,
  children,
}) => {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineType={ConnectionLineType.SmoothStep}
      minZoom={0.1}
      maxZoom={10}
      edgeTypes={edgeTypes}
      onInit={onInit}
      fitView
    >
      {children}
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
