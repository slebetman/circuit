import { Node, Edge } from 'reactflow';

export type CompilerOptions = {
	nodes: Node[];
	edges: Edge[];
	prefix?: string;
	inputPrefix?: string;
	useThis?: boolean;
	getId?: (n: Node) => string;
	all?: boolean;
	forModule?: boolean;
};

export type Compiler = (wire: Edge, opt: CompilerOptions) => [string, string[]];

export type InternalCompiler = (wire: Edge) => string | undefined;
