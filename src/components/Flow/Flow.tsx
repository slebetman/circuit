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

type FlowActionHandlers = {
  save: Function;
  new: Function;
  open: Function;
  compile: Function;
  run?: Function;
  createNode: (actionType:string) => void;
};

type FlowProps = {
  handlers: FlowActionHandlers;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (p: Connection | Edge) => any;
  onInit: (instance: ReactFlowInstance) => void;
};

const Flow: FC<FlowProps> = ({
  handlers,
  onInit,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodes,
  edges,
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
      <ToolPanel
        position="top-left"
        handlers={{
          open: handlers.open,
          save: handlers.save,
          new: handlers.new,
          compile: handlers.compile,
          run: handlers.run,
          createNode: handlers.createNode,
        }}
      />
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
