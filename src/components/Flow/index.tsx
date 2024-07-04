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
  Node,
} from "reactflow";
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge'

import styles from "./Flow.module.css";
import useChart from "hooks/useChart";
import FilePicker from "components/FilePicker/FilePicker";
import SaveDialog from "components/SaveDialog/SaveDialog";
import nodeTypes from "components/Nodes";
import { CustomSmartBezierEdge } from "./CustomSmartBezierEdge";
import ToolPanel from "components/ToolPanel/ToolPanel";
import NodesDialog from "components/NodesDialog/NodesDialog";

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
  const [toolOpen, setToolOpen] =useState(false);
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
          <ToolPanel position="top-left" handlers={{
            open: handleOpenFolder,
            save: handleSaveDialog,
            createNode: (actionType) => {
              switch(actionType) {
                case 'nodes': return setToolOpen(true);
                case 'modules': return;
              }
            },
          }} />
          <Controls />
        </ReactFlow>
      </div>
      {toolOpen &&
        <NodesDialog
          onClick={(actionType) => {
            setNodes((prev) => {
              let data: Record<string,any> = {};

              switch(actionType) {
                case 'comment':
                case 'in':
                case 'out':
                  data.label = actionType;
                  break;
              }

              return [
                ...prev,
                {
                  id: `${Math.random()}`,
                  type: actionType,
                  data,
                  position: {
                    x: 0,
                    y: 0,
                  }
                }
              ]
            })
          }}
          onClose={() => setToolOpen(false)}
        />
      }
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
