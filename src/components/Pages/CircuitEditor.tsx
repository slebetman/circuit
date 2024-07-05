import { FC, useCallback, useEffect, useState } from "react";
import Flow from "components/Flow/Flow";

import useChart from "hooks/useChart";
import FilePicker from "components/Dialogs/FilePicker";
import SaveDialog from "components/Dialogs/SaveDialog";
import NodesDialog from "components/Dialogs/NodesDialog";
import compile from "lib/compiler";
import varName from "lib/normaliseVarName";
import CodeDialog from "components/Dialogs/CodeDialog";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import { addEdge, Connection, Edge, ReactFlowInstance, useEdgesState, useNodesState } from "reactflow";

type EditorProps = {
  fileName?: string;
}

const CircuitEditor: FC<EditorProps> = ({fileName}) => {
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
    if (instance && codeOpen) {
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
      <div style={{
		flexGrow: 1,
		fontSize: '12px'
	  }}>
        <Flow
			nodes={nodes}
			edges={edges}
			onConnect={onConnect}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onInit={(i) => setInstance(i)}
			handlers={{
				open: handleOpenFolder,
				save: handleSaveDialog,
				new: handleNew,
				compile: handleCompile,
				createNode: (actionType:string) => {
					switch(actionType) {
						case 'nodes': return setNodesPaletteOpen(true);
						case 'modules': return;
					}
				}
			}}
		/>
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

export default CircuitEditor;
