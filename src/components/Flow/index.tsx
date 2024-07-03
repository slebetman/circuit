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
  DefaultEdgeOptions,
  Panel,
} from "reactflow";
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge'

import styles from "./Flow.module.css";
import Code from "components/Icons/Code";
import FloppyDisk from "components/Icons/FloppyDisk";
import FolderOpen from "components/Icons/FolderOpen";
import useChart from "hooks/useChart";
import FilePicker from "components/FilePicker/FilePicker";
import SaveDialog from "components/SaveDialog/SaveDialog";
import nodeTypes from "components/Nodes";
import { CustomSmartBezierEdge } from "./CustomSmartBezierEdge";
import NodesPanel from "components/NodesPanel/NodesPanel";

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  // type: "smart"
};

const edgeTypes = {
	smart: CustomSmartBezierEdge
}

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
      chart.save({nodes, edges});
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
      // HACK: Not sure why but need some delay to set nodes
      setNodes([]);
      setEdges([]);
      setTimeout(() => {
        setNodes(chart?.chart?.nodes || []);
        setEdges(chart?.chart?.edges || []);
      }, 0);
    }
  }, [chart.chart]);

  return (
    <>
      <div className={styles.flow}>
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
          fitView
        >
          <Panel position="top-center">
            {chart.name || null}
          </Panel>
          <NodesPanel position="top-left" handlers={{
            open: handleOpenFolder,
            save: handleSaveDialog,
          }} />
          <Controls />
        </ReactFlow>
      </div>
      {mode === "open" && (
        <FilePicker
          onSelect={handleSelectFile}
          onCancel={() => setMode("chart")}
        />
      )}
      {mode === "save" && (
        <SaveDialog
          name={chart.name}
          onSubmit={handleSave}
          onCancel={() => setMode("chart")}
        />
      )}
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
    </>
  );
}

export default Flow;
