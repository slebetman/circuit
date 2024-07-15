import { Edge, Node } from 'reactflow';
import varName from './normaliseVarName';
import { getChartRef } from './chartRefs';
import tracker from './tracker';
import cache from './cache';
import { Compiler, CompilerOptions, InternalCompiler } from './compiler/types';
import { and } from './compiler/and';
import { nand } from './compiler/nand';
import { or } from './compiler/or';
import { nor } from './compiler/nor';
import { xor } from './compiler/xor';
import { not } from './compiler/not';

const processedModules = tracker();
const processedLoops = tracker();
const moduleCache = cache<string>();

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

	let recursionCount = 0;

	const comp: InternalCompiler = (w: Edge) => {
		recursionCount++;

		if (!w) {
			return undefined;
		}

		const source = opt.nodes.find((x) => x.id === w.source);

		if (processedEdges.check(w.id) || (opt.all && recursionCount > 1)) {
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
						return and(comp, inputs);
					case 'nand':
						return nand(comp, inputs);
					case 'or':
						return or(comp, inputs);
					case 'nor':
						return nor(comp, inputs);
					case 'xor':
						return xor(comp, inputs);
					case 'not':
						return not(comp, inputs);
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

export const compileModuleNonRecursive = (
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
				const expr = compileNonRecursive({
					...opt,
					nodes: mod.nodes,
					edges: mod.edges,
					useThis: false,
					prefix: moduleNode.id,
				});
				return expr;
			}
		}
	}
};

export const compileNonRecursive = (opt: CompilerOptions) => {
	const outputs = opt.nodes.filter((x) => x.type === 'out');

	const expressions: string[] = [];
	const neededEdges: string[] = [];

	const exp = (o: Edge|Node, exp:string | undefined) => {
		const varId = opt.getId ? opt.getId(o) : (o.data?.label || o.id);
		expressions.push(`${varName(varId, opt)} = ${exp};`);
	}

	for (const o of outputs) {
		const wire = opt.edges.find((x) => x.target === o.id);
		if (wire) {
			exp(o, varName(wire.id, opt));
		}
	}

	expressions.push(...neededEdges);

	const id = (w:Edge) => varName(w.id,opt);

	for (const wire of opt.edges) {
		const source = opt.nodes.find((x) => x.id === wire.source);
		if (source) {
			const inputs = opt.edges.filter((x) => x.target === source?.id);
			if (inputs?.length) {
				switch (source.type) {
					case 'and':
						exp(wire, and(id, inputs));
						break;
					case 'nand':
						exp(wire, nand(id, inputs));
						break;
					case 'or':
						exp(wire, or(id, inputs));
						break;
					case 'nor':
						exp(wire, nor(id, inputs));
						break;
					case 'xor':
						exp(wire, xor(id, inputs));
						break;
					case 'not':
						exp(wire, not(id, inputs));
						break;
					case 'module': {
						const moduleHandle = wire.sourceHandle || wire.source;
	
						const res = compileModuleNonRecursive(moduleHandle, source, opt);

						exp(wire,res?.expr);
						break;
					}
					default:
						throw new Error('Unsupported node type!');
				}
			} else if (source.type === 'in') {
				let varId = opt.getId ? opt.getId(source) : source.data.label;
				exp(wire,`${varName(varId, opt)}`);
			}
		}
	}

	return expressions;
};