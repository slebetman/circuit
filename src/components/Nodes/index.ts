import AndGate from './AndGate';
import CommentNode from './CommentNode';
import CustomNode from './CustomNode';
import InputNode from './InputNode';
import NotGate from './NotGate';
import OrGate from './OrGate';
import OutputNode from './OutputNode';
import XorGate from './XorGate';

const nodeTypes = {
	custom: CustomNode,
	comment: CommentNode,
	and: AndGate,
	or: OrGate,
	not: NotGate,
	xor: XorGate,
	in: InputNode,
	out: OutputNode,
};

export default nodeTypes;
