import { Edge, Node } from "reactflow";
import varName from "./normaliseVarName";

type CompilerOptions = {
	nodes: Node[];
	edges: Edge[];
	prefix?: string;
	getId? : (n:Node) => string;
}

type Compiler = (wire: Edge, opt:CompilerOptions) => string;

const compile: Compiler = (wire, opt) => {
	if (!wire) {
		return 'undefined';
	}

	const source = opt.nodes.find(x => x.id === wire.source);

	if (source) {
		const inputs = opt.edges.filter(x => x.target === source?.id);
		if (inputs?.length) {
			switch (source.type) {
				case 'and':
					return `(${compile(inputs[0],opt)} && ${compile(inputs[1],opt)})`;
				case 'or':
					return `(${compile(inputs[0],opt)} || ${compile(inputs[1],opt)})`;
				case 'xor':
					return `(${compile(inputs[0],opt)} !== ${compile(inputs[1],opt)})`;
				case 'not':
					return `!(${compile(inputs[0],opt)})`;
				default:
					throw new Error('Unsupported node type!');
			}
		}
		else if (source.type === 'in') {
			let varId = opt.getId ? opt.getId(source) : source.data.label;
			return `${varName(varId, opt.prefix)}`;
		}
	}

	throw new Error('Not supposed to get here');
}

export default compile;