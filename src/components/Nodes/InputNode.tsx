import { memo, FC, useState, FormEvent, CSSProperties, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";

const labelFont: CSSProperties = {
  fontSize: "8px",
};

const nodeStyle: CSSProperties = {
  ...labelFont,
  width: "auto",
  border: "1px solid black",
  height: "20px",
  padding: "5px",
};

const editStyle: CSSProperties = {
  border: "1px solid #ccc",
  display: "flex",
  flexDirection: "row",
};

const InputNode: FC<NodeProps> = ({ data, id }) => {
  const [editmode, setEditmode] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleCommentClick = () => {
    setEditmode(true);
  };

  const handleCommentInput = (e: FormEvent<HTMLInputElement>) => {
    setLabel(e.currentTarget.value);
  };

  useEffect(() => {
    data.label = label;
  }, [label]);

  return (
    <>
      {editmode ? (
        <div style={editStyle}>
          <input
            type="text"
            value={label}
            onChange={handleCommentInput}
            onBlur={() => setEditmode(false)}
            style={labelFont}
          />
          <button onClick={() => setEditmode(false)}>OK</button>
        </div>
      ) : (
        <div onDoubleClick={handleCommentClick} style={nodeStyle}>
          {label}
        </div>
      )}
      <Handle type="source" id="c" position={Position.Right} />
    </>
  );
};

export default memo(InputNode);
