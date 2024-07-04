import { Edge, Node } from "reactflow";
import varName from "./normaliseVarName";

type Compiler = (wire: Edge, nodes: Node[], edges: Edge[]) => string;

const compile: Compiler = (wire: Edge, nodes: Node[], edges: Edge[]) => {
	if (!wire) {
		return 'undefined';
	}

	const source = nodes.find(x => x.id === wire.source);

	if (source) {
		const inputs = edges.filter(x => x.target === source?.id);
		if (inputs?.length) {
			switch (source.type) {
				case 'and':
					return `(${compile(inputs[0],nodes,edges)} && ${compile(inputs[1],nodes,edges)})`;
				case 'or':
					return `(${compile(inputs[0],nodes,edges)} || ${compile(inputs[1],nodes,edges)})`;
				case 'xor':
					return `(${compile(inputs[0],nodes,edges)} !== ${compile(inputs[1],nodes,edges)})`;
				case 'not':
					return `!(${compile(inputs[0],nodes,edges)})`;
				default:
					throw new Error('Unsupported node type!');
			}
		}
		else if (source.type === 'in') {
			return `${varName(source.data.label)}`;
		}
	}

	throw new Error('Not supposed to get here');
}

export default compile;