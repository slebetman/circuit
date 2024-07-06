import { Edge, Node } from 'reactflow';

import { compile } from "./compiler"
import varName from './normaliseVarName';
import { clearInterval } from 'timers';

type ComilerOptions = {
	nodes: Node[];
	edges: Edge[];
}

export const compileForSim = (opt:ComilerOptions) => {
	const inputs = opt.nodes
		.filter(x => x.type === 'in')
		.map(x => varName(x.id));

	const outputs = opt.nodes
		.filter(x => x.type === 'out')
		.map(x => varName(x.id));

	const expressions = compile({
		...opt,
		getId: (n) => n.id,
		prefix: 'this',
	});

	let ret = {
		inputs,
		outputs,
		state: {
			...inputs.reduce((a,v) => {
				a[v] = undefined;
				return a;
			},{} as Record<string, any>)
		}
	};

	expressions.forEach(v => {
		const [key, expr] = v.split('=').map(x => x.trim());
		Object.defineProperty(ret.state, key, {
			enumerable: true,
			get: new Function(`return ${expr}`) as () => any,
		})
	});

	return ret;
}

export const simulator = (opt: ComilerOptions) => {
	const simData = compileForSim(opt);

	let interval: any;

	function stop () {
		clearInterval(interval);
	}

	function step (updater?:Function) {
		const newState = {
			...simData.state
		};

		if (updater) updater(newState);

		return newState;
	}

	function start (updater?:Function) {
		stop();
		interval = setInterval(() => step(updater), 50);
	}

	function set (key:string, val: boolean) {
		simData.state[key] = val;
	}

	return {
		inputs: simData.inputs,
		state: simData.state,
		start,
		stop,
		step,
		set,
	}
}
