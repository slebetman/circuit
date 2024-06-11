import { useCallback } from "react";
import ReactFlow, {
  Node,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionLineType,
  Controls,
  ControlButton,
} from "reactflow";
import CustomNode from "./CustomNode";
import CommentNode from "./CommentNode";

import styles from "./Flow.module.css";
import Code from "components/Icons/Code";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    data: { label: "Node 2" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Node 3" },
    position: { x: 400, y: 100 },
  },
  {
    id: "4",
    data: { label: "Node 4" },
    position: { x: 400, y: 200 },
    type: "custom",
    className: styles.customNode,
  },
  {
    id: "5",
    data: { label: "This is a comment" },
    position: { x: 10, y: 0 },
    type: "comment",
    className: styles.commentNode,
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e1-3", source: "1", target: "3" },
];

const nodeTypes = {
  custom: CustomNode,
  comment: CommentNode,
};

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={styles.flow}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
      >
        <Controls>
          <ControlButton onClick={() => console.log("Nodes", nodes)}>
            <Code />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );
}

export default Flow;
