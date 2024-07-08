import AndGate from './AndGate';
import CommentNode from './CommentNode';
import InputNode from './InputNode';
import Module from './Module';
import NotGate from './NotGate';
import OrGate from './OrGate';
import OutputNode from './OutputNode';
import XorGate from './XorGate';

const nodeTypes = {
	comment: CommentNode,
	and: AndGate,
	or: OrGate,
	not: NotGate,
	xor: XorGate,
	in: InputNode,
	out: OutputNode,
	module: Module,
};

export default nodeTypes;
