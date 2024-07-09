import { Edge, Node } from 'reactflow';
import varName from './normaliseVarName';
import { getChartRef } from './chartRefs';
import tracker from './tracker';

const processedModules = tracker();
const processedLoops = tracker();

type CompilerOptions = {
	nodes: Node[];
	edges: Edge[];
	prefix?: string;
	inputPrefix?: string;
	useThis?: boolean;
	getId?: (n: Node) => string;
	all?: boolean;
	forModule?: boolean;
};

type Compiler = (wire: Edge, opt: CompilerOptions) => [string, string[]];

type InternalCompiler = (wire: Edge) => string;

export const compileModule = (
	sourceId: string,
	moduleNode: Node,
	opt: CompilerOptions,
) => {
	const chartRef = getChartRef();

	const mod = chartRef?.modules?.find((x) => x.type === moduleNode.data.type);

	if (mod) {
		const outputs = mod.nodes.filter((x) => x.type === 'out');

		let output: Node | undefined;

		if (sourceId === moduleNode.id) {
			output = outputs[0];
		} else {
			output = outputs.find(
				(x) => `${moduleNode.id}_${x.id}` === sourceId,
			);
		}

		if (output) {
			const wire = mod.edges.find((x) => x.target === output.id);

			if (wire) {
				const loopExpressions: string[] = [];
				const [expr, loops] = compileWire(wire, {
					...opt,
					nodes: mod.nodes,
					edges: mod.edges,
					useThis: false,
					prefix: moduleNode.id,
					forModule: true,
					all: false,
					getId: (n) => {
						if (n.type === 'in') {
							const sourceWire = opt.edges.find(
								(x) =>
									x.target === moduleNode.id &&
									x.targetHandle ===
										`${moduleNode.id}_${n.id}`,
							);
							if (sourceWire) {
								const [expr, loops] = compileWire(
									sourceWire,
									opt,
								);
								loopExpressions.push(...loops);
								return expr;
							}
							return 'undefined';
						}
						return opt.getId ? opt.getId(n) : n.data?.label || n.id;
					},
				});
				loopExpressions.push(...loops);
				return { expr, loops: loopExpressions };
			}
		}
	}
};

export const compile = (opt: CompilerOptions) => {
	const outputs = opt.nodes.filter((x) => x.type === 'out');

	processedModules.clear();
	processedLoops.clear();

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

	expressions.push(...neededEdges);

	if (opt.all) {
		for (const wire of opt.edges) {
			const [expr] = compileWire(wire, opt);
			expressions.push(`${varName(wire.id)} = ${expr};`);
		}
	}

	return expressions;
};

export const compileWire: Compiler = (wire, opt) => {
	const processedEdges = tracker();
	const loops: string[] = [];
	const loopExpressions: string[] = [];

	const comp: InternalCompiler = (w: Edge) => {
		if (!w) {
			return 'undefined';
		}

		const source = opt.nodes.find((x) => x.id === w.source);

		if (processedEdges.check(w.id)) {
			if (!processedLoops.check(w.id)) {
				processedLoops.set(w.id);
				loops.push(w.id);
			}
			return varName(`${w.id}`, {
				withThis: opt.useThis || opt.forModule,
				prefix: opt.prefix,
			});
		}

		processedEdges.set(w.id);

		if (source) {
			const inputs = opt.edges.filter((x) => x.target === source?.id);
			if (inputs?.length) {
				switch (source.type) {
					case 'and':
						return `(${comp(inputs[0])} && ${comp(inputs[1])})`;
					case 'or':
						return `(${comp(inputs[0])} || ${comp(inputs[1])})`;
					case 'xor':
						return `(${comp(inputs[0])} !== ${comp(inputs[1])})`;
					case 'not':
						return `!(${comp(inputs[0])})`;
					case 'module': {
						if (processedModules.check(source.id)) {
							if (!processedLoops.check(w.id)) {
								processedLoops.set(w.id);
								loops.push(w.id);
							}
							return varName(`${w.id}`, {
								withThis: opt.useThis || opt.forModule,
								prefix: opt.prefix,
							});
						}

						processedModules.set(source.id);

						const res = compileModule(
							w.sourceHandle || w.source,
							source,
							opt,
						);
						if (res) {
							loopExpressions.push(...res.loops);
						}
						return `(${res?.expr || 'undefined'})`;
					}
					default:
						throw new Error('Unsupported node type!');
				}
			} else if (source.type === 'in') {
				let varId = opt.getId ? opt.getId(source) : source.data.label;
				return `${varName(varId, {
					withThis: opt.useThis,
					prefix: opt.inputPrefix,
				})}`;
			}
		}

		throw new Error('Not supposed to get here');
	};

	const expression = comp(wire);

	const neededEdges = loops
		.map((w) => opt.edges.find((x) => x.id === w))
		.filter((w) => w);

	loopExpressions.push(
		...neededEdges.map((loopWire) => {
			if (loopWire) {
				processedEdges.clear();

				return `${varName(loopWire.id, {
					prefix: opt.prefix,
				})} = ${comp(loopWire)}`;
			} else {
				return '';
			}
		}),
	);

	return [expression, loopExpressions.filter((x) => x !== '')];
};
