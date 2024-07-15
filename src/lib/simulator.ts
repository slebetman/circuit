import { Edge, Node } from 'reactflow';

import { compile, compileNonRecursive } from './compiler';
import varName from './normaliseVarName';

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
		.filter((x) => x.type === 'in')
		.map((x) => varName(x.id));

	const outputs = opt.nodes
		.filter((x) => x.type === 'out')
		.map((x) => varName(x.id));

	const expressions = compile({
		...opt,
		getId: (n) => n.id,
		useThis: true,
		all: true,
	});

	console.log(expressions);

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
		const [key, ...expr] = v.split('=').map((x) => x.trim());
		ret.state[key] = undefined;
		const functionBody = `this["${key}"] = ${expr.join('=')}`;
		ret.state[`func_${key}`] = new Function(functionBody);
	});

	return ret;
};

export const compileForSimNonRecursive = (opt: ComilerOptions) => {
	const inputs = opt.nodes
		.filter((x) => x.type === 'in')
		.map((x) => varName(x.id));

	const outputs = opt.nodes
		.filter((x) => x.type === 'out')
		.map((x) => varName(x.id));

	const expressions = compileNonRecursive({
		...opt,
		getId: (n) => n.id,
		useThis: true,
		all: true,
	});

	console.log(expressions);

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

	ret.state.func_updater = new Function(expressions.join('\n'));

	return ret;
};

export const simulator = (opt: ComilerOptions) => {
	const simData = compileForSimNonRecursive(opt);

	let interval: any;

	function stop() {
		clearInterval(interval);
	}

	function step(updater?: UpdaterFunction) {
		for (const k in simData.state) {
			if (typeof simData.state[k] === 'function') {
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
		interval = setInterval(() => step(updater), 10);
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
