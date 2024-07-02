import Or from "components/Icons/Or";
import { memo, FC, CSSProperties } from "react";
import { NodeProps, Handle, Position } from "reactflow";

const nodeStyle: CSSProperties = {
  border: "1px solid #000",
  backgroundColor: "#fff",
  padding: "2px 5px",
  height: "20px",
};

const OrGate: FC<NodeProps> = ({ data, id }) => {
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
