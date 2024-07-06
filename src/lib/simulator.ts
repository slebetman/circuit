import { Edge, Node } from "reactflow";

import { compile } from "./compiler";
import varName from "./normaliseVarName";

type ComilerOptions = {
  nodes: Node[];
  edges: Edge[];
};

export type SimState = Record<string, any>;

export type SimObject = {
  inputs: string[];
  state: SimState;
  start: (updater?: UpdaterFunction) => void;
  stop: Function;
  step: (updater?: UpdaterFunction) => void;
  set: (key: string, val: boolean) => void;
};

export type UpdaterFunction = (state: SimState) => void;

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
      ...inputs.reduce((a, v) => {
        a[v] = false;
        return a;
      }, {} as SimState),
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

  function step(updater?: UpdaterFunction) {
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

  function start(updater?: UpdaterFunction) {
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
  } as SimObject;
};
