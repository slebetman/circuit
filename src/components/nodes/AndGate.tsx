import And from "components/Icons/And";
import { memo, FC, CSSProperties } from "react";
import { NodeProps, Handle, Position } from "reactflow";

const nodeStyle: CSSProperties = {
  border: "1px solid #000",
  backgroundColor: "#fff",
  padding: "2px 5px",
  height: "20px",
};

const AndGate: FC<NodeProps> = ({ data, id }) => {
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
      <And />
      <Handle
        type="source"
        id="c"
        position={Position.Right}
        style={{ top: "10px" }}
      />
    </>
  );
};

export default memo(AndGate);
