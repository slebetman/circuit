import Not from "components/Icons/Not";
import { memo, FC } from "react";
import { NodeProps, Handle, Position } from "reactflow";

const NotGate: FC<NodeProps> = ({ id, selected }) => {
  return (
    <>
      <Handle
        type="target"
        id="a"
        position={Position.Left}
        style={{ top: "10px" }}
      />
      <Not selected={selected} />
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
