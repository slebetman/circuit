import AndGate from "./AndGate";
import CommentNode from "./CommentNode";
import CustomNode from "./CustomNode";
import NotGate from "./NotGate";
import OrGate from "./OrGate";
import XorGate from "./XorGate";

const nodeTypes = {
  custom: CustomNode,
  comment: CommentNode,
  and: AndGate,
  or: OrGate,
  not: NotGate,
  xor: XorGate,
};

export default nodeTypes;
