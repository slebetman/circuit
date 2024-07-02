
import Not from "components/Icons/Not";
import { memo, FC } from "react";
import { NodeProps, Handle, Position } from "reactflow";

const NotGate: FC<NodeProps> = () => {
  return (
    <>
      <Handle
        type="target"
        id="a"
        position={Position.Left}
        style={{ top: "10px" }}
      />
      <Not />
      <Handle
        type="source"
        id="c"
        position={Position.Right}
        style={{ top: "10px" }}
      />
    </>
  );
};

export default memo(NotGate);
