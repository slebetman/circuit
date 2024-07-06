import { Edge, Node } from "reactflow";

import { compile } from "./compiler";
import varName from "./normaliseVarName";

type ComilerOptions = {
  nodes: Node[];
  edges: Edge[];
};

export const compileForSim = (opt: ComilerOptions) => {
  const inputs = opt.nodes
    .filter((x) => x.type === "in")
    .map((x) => varName(x.id));

  const outputs = opt.nodes
    .filter((x) => x.type === "out")
    .map((x) => varName(x.id));

  const expressions = compile({
    ...opt,
    getId: (n) => n.id,
    prefix: "this",
  });

  let ret = {
    inputs,
    outputs,
    state: {
      ...inputs.reduce(
        (a, v) => {
          a[v] = undefined;
          return a;
        },
        {} as Record<string, any>,
      ),
    },
  };

  expressions.forEach((v) => {
    const [key, ...expr] = v.split("=").map((x) => x.trim());
    ret.state[key] = undefined;
    ret.state[`func_${key}`] = new Function(
      `this["${key}"] = ${expr.join("=")}`,
    );
  });

  return ret;
};

export const simulator = (opt: ComilerOptions) => {
  const simData = compileForSim(opt);

  let interval: any;

  function stop() {
    clearInterval(interval);
  }

  function step(updater?: Function) {
    for (const k in simData.state) {
      if (typeof simData.state[k] === "function") {
        simData.state[k]();
      }
    }

    const newState = {
      ...simData.state,
    };

    if (updater) updater(newState);

    return newState;
  }

  function start(updater?: Function) {
    stop();
    interval = setInterval(() => step(updater), 50);
  }

  function set(key: string, val: boolean) {
    simData.state[key] = val;
  }

  return {
    inputs: simData.inputs,
    state: simData.state,
    start,
    stop,
    step,
    set,
  };
};
