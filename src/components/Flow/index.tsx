import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
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
import FloppyDisk from "components/Icons/FloppyDisk";
import FolderOpen from "components/Icons/FolderOpen";
import useChart from "components/hooks/useChart";
import FilePicker from "components/FilePicker/FilePicker";
import SaveDialog from "components/SaveDialog/SaveDialog";

const nodeTypes = {
  custom: CustomNode,
  comment: CommentNode,
};

const defaultEdgeOptions = {
  type: "smoothstep",
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [mode, setMode] = useState<"open" | "save" | "chart">("chart");
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const chart = useChart();

  const handleSaveDialog = () => {
    setMode("save");
  };

  const handleSave = (name: string) => {
    if (!name?.match(/.json$/)) {
      name += ".json";
    }

    if (name) {
      chart.setName(name);
      chart.save({
        nodes,
        edges,
      });
    }

    setMode("chart");
  };

  const handleOpenFolder = () => {
    setMode("open");
  };

  const handleSelectFile = (f: string) => {
    chart.load(f);
    setMode("chart");
  };

  useEffect(() => {
    if (chart.chart) {
      setNodes(chart.chart.nodes);
      setEdges(chart.chart.edges);
    }
  }, [chart.chart]);

  const renderChart = () => (
    <div className={styles.flow}>
      <div
        style={{
          position: "fixed",
        }}
      >
        Chart: {chart.name}
      </div>
      {chart.error ? (
        <div
          style={{
            position: "absolute",
            top: "45vh",
            textAlign: "center",
            width: "100%",
            zIndex: "9999999",
          }}
        >
          <span
            style={{
              padding: "10px",
              backgroundColor: "#f66",
            }}
          >
            Error: {chart.error.message} &nbsp;
            <button
              onClick={() => {
                chart.clearError();
              }}
            >
              x
            </button>
          </span>
        </div>
      ) : null}
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
          <ControlButton
            title="dump nodes"
            onClick={() => console.log("Nodes", nodes)}
          >
            <Code />
          </ControlButton>
          <ControlButton title="save chart" onClick={handleSaveDialog}>
            <FloppyDisk />
          </ControlButton>
          <ControlButton title="open chart" onClick={handleOpenFolder}>
            <FolderOpen />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </div>
  );

  const renderFilePicker = () => (
    <FilePicker onSelect={handleSelectFile} onCancel={() => setMode("chart")} />
  );

  const renderSaveDialog = () => (
    <SaveDialog
      name={chart.name}
      onSubmit={handleSave}
      onCancel={() => setMode("chart")}
    />
  );

  switch (mode) {
    case "open":
      return renderFilePicker();
    case "save":
      return renderSaveDialog();
    default:
      return renderChart();
  }
}

export default Flow;
