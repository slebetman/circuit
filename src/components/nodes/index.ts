import AndGate from "./AndGate";
import CommentNode from "./CommentNode";
import CustomNode from "./CustomNode";
import OrGate from "./OrGate";

const nodeTypes = {
  custom: CustomNode,
  comment: CommentNode,
  and: AndGate,
  or: OrGate,
};

export default nodeTypes;
