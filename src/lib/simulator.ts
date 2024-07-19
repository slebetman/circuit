import { Edge, Node } from 'reactflow';

import { compileNonRecursive } from './compiler';
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
	setSpeed: (speed: number, delay: number) => void;
};

export type UpdaterFunction = (state: SimState) => void;

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

	let running: boolean;
	let SPEED = 1; // 19, 313, 1913, 2687
	let DELAY = 1;

	function stop() {
		running = false;
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
		running = true;
		setTimeout(function loop() {
			if (running) {
				for (let i = 0; i < SPEED; i++) step(updater);
				setTimeout(loop, DELAY);
			}
		}, DELAY);
	}

	function set(key: string, val: boolean) {
		simData.state[key] = val;
	}

	function setSpeed(speed: number, delay: number) {
		SPEED = speed;
		DELAY = delay;
	}

	return {
		inputs: simData.inputs,
		state: simData.state,
		start,
		stop,
		step,
		set,
		setSpeed,
	} as SimObject;
};
