import Or from "components/Icons/Or";
import { memo, FC } from "react";
import { NodeProps, Handle, Position } from "reactflow";

const OrGate: FC<NodeProps> = ({id}) => {
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
      <Or />
      <Handle
        type="source"
        id="c"
        position={Position.Right}
        style={{ top: "10px" }}
      />
    </>
  );
};

export default memo(OrGate);
