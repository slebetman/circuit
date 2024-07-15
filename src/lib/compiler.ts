import { Edge, Node } from 'reactflow';
import varName from './normaliseVarName';
import { getChartRef } from './chartRefs';
import tracker from './tracker';
import cache from './cache';

const processedModules = tracker();
const processedLoops = tracker();
const moduleCache = cache<string>();

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

type InternalCompiler = (wire: Edge) => string | undefined;

export const compileModule = (
	sourceId: string,
	moduleNode: Node,
	opt: CompilerOptions
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
				(x) => `${moduleNode.id}_${x.id}` === sourceId
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
										`${moduleNode.id}_${n.id}`
							);
							if (sourceWire) {
								const [expr, loops] = compileWire(
									sourceWire,
									opt
								);
								loopExpressions.push(...loops);
								return expr;
							}
							return undefined;
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
	moduleCache.clear();

	const expressions: string[] = [];
	const neededEdges: string[] = [];

	for (const o of outputs) {
		const wire = opt.edges.find((x) => x.target === o.id);

		if (wire) {
			const [expr, loops] = compileWire(wire, opt);
			let varId = opt.getId ? opt.getId(o) : o.data.label;
			if (expr !== undefined) {
				expressions.push(`${varName(varId)} = ${expr};`);
			}
			neededEdges.push(...loops);
		}
	}

	expressions.push(...neededEdges);

	if (opt.all) {
		for (const wire of opt.edges) {
			const [expr] = compileWire(wire, opt);
			if (expr !== undefined) {
				expressions.push(`${varName(wire.id)} = ${expr};`);
			}
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
			return undefined;
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
					case 'and': {
						const a = comp(inputs[0]);
						const b = comp(inputs[1]);

						// simplifying step in case one of the values never changes
						switch (a) {
							case undefined:
							case 'false':
								return undefined;
							case 'true':
								return b;
						}
						switch (b) {
							case undefined:
							case 'false':
								return undefined;
							case 'true':
								return a;
						}

						return `(${a} && ${b})`;
					}
					case 'nand': {
						const a = comp(inputs[0]);
						const b = comp(inputs[1]);

						// simplifying step in case one of the values never changes
						switch (a) {
							case undefined:
							case 'false':
								return 'true';
							case 'true':
								return `!(${b})`;
						}
						switch (b) {
							case undefined:
							case 'false':
								return 'true';
							case 'true':
								return `!(${a})`;
						}

						return `!(${a} && ${b})`;
					}
					case 'or': {
						const a = comp(inputs[0]);
						const b = comp(inputs[1]);

						// simplifying step in case one of the values never changes
						switch (a) {
							case undefined:
							case 'false':
								return b;
							case 'true':
								return 'true';
						}
						switch (b) {
							case undefined:
							case 'false':
								return a;
							case 'true':
								return 'true';
						}

						return `(${a} || ${b})`;
					}

					case 'nor': {
						const a = comp(inputs[0]);
						const b = comp(inputs[1]);

						// simplifying step in case one of the values never changes
						switch (a) {
							case undefined:
							case 'false':
								return `!(${b})`;
							case 'true':
								return 'false';
						}
						switch (b) {
							case undefined:
							case 'false':
								return `!(${a})`;
							case 'true':
								return 'false';
						}

						return `!(${a} || ${b})`;
					}
					case 'xor': {
						const a = comp(inputs[0]);
						const b = comp(inputs[1]);

						// simplifying step in case the values never change
						if (a === b) {
							return 'false';
						}

						return `(${a} !== ${b})`;
					}
					case 'not': {
						const a = comp(inputs[0]);

						// simplifying step in case the value never changes
						if (a === undefined) {
							return 'true';
						}

						return `!(${a})`;
					}
					case 'module': {
						const outputs = opt.edges.filter(
							(x) => x.source === source?.id
						);
						const moduleHandle = w.sourceHandle || w.source;

						if (
							processedModules.check(source.id) >
							outputs.length - 1
						) {
							if (!processedLoops.check(w.id)) {
								processedLoops.set(w.id);
								loops.push(w.id);
							}
							return moduleCache.get(
								`${source.id}:${moduleHandle}`
							);
						}

						processedModules.set(source.id);

						const res = compileModule(moduleHandle, source, opt);

						if (res) {
							moduleCache.set(
								`${source.id}:${moduleHandle}`,
								res.expr
							);
							loopExpressions.push(...res.loops);
						}
						return `(${res?.expr})`;
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

	const expression = comp(wire) || 'undefined';

	const neededEdges = loops
		.map((w) => opt.edges.find((x) => x.id === w))
		.filter((w) => w);

	loopExpressions.push(
		...neededEdges.map((loopWire) => {
			if (loopWire) {
				processedEdges.clear();

				const ex = comp(loopWire);

				if (ex !== undefined) {
					return `${varName(loopWire.id, {
						prefix: opt.prefix,
					})} = ${ex};`;
				}
			}
			return '';
		})
	);

	return [expression, loopExpressions.filter((x) => x !== '')];
};
