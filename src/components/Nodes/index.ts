import AndGate from './AndGate';
import CommentNode from './CommentNode';
import InputNode from './InputNode';
import Module from './Module';
import NandGate from './NandGate';
import NorGate from './NorGate';
import NotGate from './NotGate';
import OrGate from './OrGate';
import OutputNode from './OutputNode';
import XorGate from './XorGate';

const nodeTypes = {
	comment: CommentNode,
	and: AndGate,
	nand: NandGate,
	or: OrGate,
	not: NotGate,
	nor: NorGate,
	xor: XorGate,
	in: InputNode,
	out: OutputNode,
	module: Module,
};

export default nodeTypes;
