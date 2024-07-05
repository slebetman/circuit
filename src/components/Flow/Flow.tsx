import { FC, useCallback, useEffect, useState } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  ConnectionLineType,
  Controls,
  DefaultEdgeOptions,
  Panel,
  ReactFlowInstance,
} from "reactflow";
import { SmartBezierEdge } from '@tisoap/react-flow-smart-edge'

import styles from "./Flow.module.css";
import useChart from "hooks/useChart";
import FilePicker from "components/Dialogs/FilePicker";
import SaveDialog from "components/Dialogs/SaveDialog";
import nodeTypes from "components/Nodes";
import { CustomSmartBezierEdge } from "./CustomSmartBezierEdge";
import ToolPanel from "components/ToolPanel/ToolPanel";
import NodesDialog from "components/Dialogs/NodesDialog";
import compile from "lib/compiler";
import varName from "lib/normaliseVarName";
import CodeDialog from "components/Dialogs/CodeDialog";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  // type: "smart"
};

const edgeTypes = {
	smart: CustomSmartBezierEdge
}

type FlowProps = {
  fileName?: string;
}

const Flow: FC<FlowProps> = ({fileName}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [instance, setInstance] = useState<ReactFlowInstance | null>(null);
  const [mode, setMode] = useState<"open" | "save" | "chart">("chart");
  const [nodesPaletteOpen, setNodesPaletteOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState<string[]>([]);
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const chart = useChart();

  const router = useRouter();

  const handleNew = () => {
    setNodes([]);
    setEdges([]);
    router.replace('/');
  }

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
      router.replace(`/${name}`);
    }

    setMode("chart");
  };

  const handleOpenFolder = () => {
    setMode("open");
  };

  const handleSelectFile = (f: string) => {
    setMode("chart");
    router.replace(`/${f}`);
  };

  const handleCompile = () => {
    setCodeOpen(true);
  }

  useEffect(() => {
    if (instance) {
      const n = instance.getNodes();
      const e = instance.getEdges();

      const outputs = n.filter(x => x.type === 'out');

      const expressions: string[] = [];
      const neededEdges: string[] = [];

      for (const o of outputs) {
        const wire = e.find(x => x.target === o.id);
        
        if (wire) {
          const [expr, loops] = compile(wire,{
            nodes:n,
            edges:e,
          });
          expressions.push(`${varName(o.data.label)} = ${expr};`);
          neededEdges.push(...loops);
        }
      }

      for (const w of neededEdges) {
        const wire = instance.getEdge(w);

        if (wire) {
          const [expr] = compile(wire,{
            nodes:n,
            edges:e,
          });
          expressions.push(`${varName(w)} = ${expr};`);
        }
      }

      console.log(expressions);
      setCode(expressions);
    }
  }, [codeOpen, nodes, edges])

  useEffect(() => {
    if (chart.chart) {
      // HACK: Not sure why but need some delay to set nodes
      setNodes([]);
      setEdges([]);
      setTimeout(() => {
        setNodes(chart?.chart?.nodes || []);
        setEdges(chart?.chart?.edges || []);
        setTimeout(() => {
          instance?.fitView({
            padding: 0.25
          });
        }, 50);
      }, 0);
    }
  }, [chart.chart]);

  useEffect(() => {
    if (fileName) {
      chart.load(fileName);
    }
  },[fileName])

  const generateId = () => {
    let ok = false;
    let id;
    // retry if id is duplicate
    while (!ok) {
      id = nanoid(5);
      if (!(instance?.getNode(id))) {
        ok = true;
      }
    }
    return id;
  }

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
          onInit={(i) => setInstance(i)}
          fitView
        >
          <Panel position="top-center">
            {chart.name || null}
          </Panel>
          <ToolPanel position="top-left" handlers={{
            open: handleOpenFolder,
            save: handleSaveDialog,
            new: handleNew,
            compile: handleCompile,
            createNode: (actionType) => {
              switch(actionType) {
                case 'nodes': return setNodesPaletteOpen(true);
                case 'modules': return;
              }
            },
          }} />
          <Controls />
        </ReactFlow>
      </div>
      {nodesPaletteOpen &&
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
                  id: `${generateId()}`,
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
          onClose={() => setNodesPaletteOpen(false)}
        />
      }
      {codeOpen && (
        <CodeDialog
          onClose={() => setCodeOpen(false)}
          code={code}
        />
      )}
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
