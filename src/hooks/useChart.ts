import { Node, Edge } from "reactflow";
import { useEffect, useState } from "react";

export type Chart = {
  nodes: Node<any>[];
  edges: Edge<any>[];
};

const useChart = () => {
  const [name, setName] = useState<string>("");
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [chart, setChart] = useState<Chart | null>(null);

  const load = async (filename: string) => {
    setName(filename);
    setIsBusy(true);

    try {
      const res = await fetch(`/api/charts/${filename}`);
      const chart = await res.json();
      setChart(chart);
    } catch (err) {
      setError(err as Error);
    }
    setIsBusy(false);
  };

  const save = async (c: Chart) => {
    setChart({
      nodes: c.nodes.map((x) => {
        delete x.positionAbsolute;
        delete x.width;
        delete x.height;
        delete x.selected;
        delete x.dragging;

        if (x.data && Object.keys(x.data).length === 0) {
          delete x.data;
        } else if (x.data) {
          delete x.data.on;
          delete x.data.sim;
        }

        return x;
      }),
      edges: c.edges.map((x) => {
        delete x.type;
        if (x.sourceHandle === null) {
          delete x.sourceHandle;
        }
        if (x.targetHandle === null) {
          delete x.targetHandle;
        }

        if (x.data) {
          delete x.data;
        }

        if (x.style) {
          delete x.style;
        }

        return x;
      }),
    });
  };

  useEffect(() => {
    (async () => {
      setIsBusy(true);
      if (!chart) return;
      try {
        if (!name) {
          throw new Error("Chart has no name!");
        }

        await fetch(`/api/charts/${name}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chart),
        });
      } catch (err) {
        setError(err as Error);
      }

      setIsBusy(false);
    })();
  }, [chart]);

  const clearError = () => {
    setError(null);
  };

  return {
    isBusy,
    name,
    setName: (n: string) => setName(n),
    error,
    chart,
    load,
    save,
    clearError,
  };
};

export default useChart;
