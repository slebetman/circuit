import Xor from "components/Icons/Xor";
import { memo, FC } from "react";
import { NodeProps, Handle, Position } from "reactflow";

const XorGate: FC<NodeProps> = ({id}) => {
  return (
    <>
      <Handle
        type="target"
        id="a"
        position={Position.Left}
        style={{ top: "6px" }}
      />
      <Handle
        type="target"
        id="b"
        position={Position.Left}
        style={{ top: "15px" }}
      />
      <Xor />
      <span style={{ fontSize: '5px' }}>{id}</span>
      <Handle
        type="source"
        id="c"
        position={Position.Right}
        style={{ top: "10px" }}
      />
    </>
  );
};

export default memo(XorGate);
