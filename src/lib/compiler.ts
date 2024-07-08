import { Edge, Node } from 'reactflow';
import varName from './normaliseVarName';
import { ModuleProps } from 'components/Nodes/Module';
import { useChartRefs } from 'hooks/useChart';

type CompilerOptions = {
	nodes: Node[];
	edges: Edge[];
	prefix?: string;
	inputPrefix?: string;
	useThis?: boolean;
	getId?: (n: Node) => string;
	all?: boolean;
};

type Compiler = (wire: Edge, opt: CompilerOptions) => [string, string[]];

type InternalCompiler = (wire: Edge) => string;

export const compileModule = (
	sourceId: string,
	moduleNode: Node,
	inputs: Edge[],
	opt: CompilerOptions,
) => {
	const chartRef = useChartRefs();

	const module = chartRef?.modules?.find(
		(x) => x.type === moduleNode.data.type,
	);

	if (module) {
		const outputs = module.nodes.filter((x) => x.type === 'out');
		const inputs = module.nodes.filter((x) => x.type === 'in');

		let output: Node | undefined;

		if (sourceId === moduleNode.id) {
			output = outputs[0];
		} else {
			output = outputs.find(
				(x) => `${moduleNode.id}_${x.id}` === sourceId,
			);
		}

		if (output) {
			const wire = module.edges.find((x) => x.target === output.id);

			if (wire) {
				const [expr] = compileWire(wire, {
					...opt,
					nodes: module.nodes,
					edges: module.edges,
					useThis: false,
					prefix: moduleNode.id,
					all: false,
					getId: (n) => {
						if (n.type === 'in') {
							const sourceWire = opt.edges.find(
								(x) =>
									x.target === moduleNode.id &&
									x.targetHandle === `${moduleNode.id}_${n.id}`,
							);
							if (sourceWire) {
								const [expr] = compileWire(sourceWire, opt);
								return expr;
							}
							return 'undefined';
						}
						return opt.getId ? opt.getId(n) : n.data?.label || n.id;
					},
				});
				return expr;
			}
		}
	}
};

export const compile = (opt: CompilerOptions) => {
	const outputs = opt.nodes.filter((x) => x.type === 'out');

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

	if (opt.all) {
		for (const wire of opt.edges) {
			const [expr] = compileWire(wire, opt);
			expressions.push(`${varName(wire.id)} = ${expr};`);
		}
	} else {
		for (const w of neededEdges) {
			const wire = opt.edges.find((x) => x.id === w);

			if (wire) {
				const [expr] = compileWire(wire, opt);
				expressions.push(`${varName(w)} = ${expr};`);
			}
		}
	}

	return expressions;
};

export const compileWire: Compiler = (wire, opt) => {
	const processedEdges: Record<string, boolean> = {};
	const loops: string[] = [];

	const comp: InternalCompiler = (w: Edge) => {
		if (!w) {
			return 'undefined';
		}

		const source = opt.nodes.find((x) => x.id === w.source);

		if (processedEdges[w.id]) {
			loops.push(w.id);
			return varName(w.id, {
				withThis: opt.useThis,
				prefix: opt.prefix,
			});
		}

		processedEdges[w.id] = true;

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
					case 'module':
						return `(${compileModule(w.sourceHandle || w.source, source, inputs, opt)})`;
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

	return [comp(wire), loops];
};
