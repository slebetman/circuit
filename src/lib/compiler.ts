import { Edge, Node } from "reactflow";
import varName from "./normaliseVarName";

type CompilerOptions = {
  nodes: Node[];
  edges: Edge[];
  prefix?: string;
  getId?: (n: Node) => string;
};

type Compiler = (wire: Edge, opt: CompilerOptions) => [string, string[]];

type InternalCompiler = (wire: Edge) => string;

export const compile = (opt:CompilerOptions) => {
  const outputs = opt.nodes.filter((x) => x.type === "out");

  const expressions: string[] = [];
  const neededEdges: string[] = [];

  for (const o of outputs) {
    const wire = opt.edges.find((x) => x.target === o.id);

    if (wire) {
      const [expr, loops] = compileWire(wire, opt);
      let varId = opt.getId ? opt.getId(o) : o.data.label;
      expressions.push(`${varName(varId)} = ${expr};`);
      neededEdges.push(...loops);
    }
  }

  for (const w of neededEdges) {
    const wire = opt.edges.find(x => x.id === w);

    if (wire) {
      const [expr] = compileWire(wire, opt);
      expressions.push(`${varName(w)} = ${expr};`);
    }
  }

  return expressions;
}

export const compileWire: Compiler = (wire, opt) => {
  const processedEdges: Record<string, boolean> = {};
  const loops: string[] = [];

  const comp: InternalCompiler = (w: Edge) => {
    if (!w) {
      return "undefined";
    }

    const source = opt.nodes.find((x) => x.id === w.source);

    if (processedEdges[w.id]) {
      loops.push(w.id);
      return w.id;
    }

    processedEdges[w.id] = true;

    if (source) {
      const inputs = opt.edges.filter((x) => x.target === source?.id);
      if (inputs?.length) {
        switch (source.type) {
          case "and":
            return `(${comp(inputs[0])} && ${comp(inputs[1])})`;
          case "or":
            return `(${comp(inputs[0])} || ${comp(inputs[1])})`;
          case "xor":
            return `(${comp(inputs[0])} !== ${comp(inputs[1])})`;
          case "not":
            return `!(${comp(inputs[0])})`;
          default:
            throw new Error("Unsupported node type!");
        }
      } else if (source.type === "in") {
        let varId = opt.getId ? opt.getId(source) : source.data.label;
        return `${varName(varId, opt.prefix)}`;
      }
    }

    throw new Error("Not supposed to get here");
  };

  return [comp(wire), loops];
};

