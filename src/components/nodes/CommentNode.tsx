import { Chart } from "../hooks/useChart";
import {
  memo,
  FC,
  useState,
  FormEvent,
  CSSProperties,
  useCallback,
  useEffect,
} from "react";
import { NodeProps, Node, useOnSelectionChange } from "reactflow";

const commentFont: CSSProperties = {
  fontFamily: "monospace",
  fontSize: "10px",
  fontStyle: "italic",
  whiteSpace: "pre-wrap",
};

const textStyle: CSSProperties = {
  ...commentFont,
  width: "20rem",
  height: "5rem",
};

const nodeStyle: CSSProperties = {
  ...commentFont,
  border: "1px solid #ffa",
  backgroundColor: "#ffa",
  padding: "2px 5px",
};

const nodeSelectedStyle: CSSProperties = {
  ...nodeStyle,
  border: "1px solid black",
};

const editStyle: CSSProperties = {
  border: "1px solid #ccc",
  display: "flex",
  flexDirection: "column",
};

const CommentNode: FC<NodeProps> = ({ data, id }) => {
  const [editmode, setEditmode] = useState(false);
  const [comment, setComment] = useState(data.label);
  const [isSelected, setIsSelected] = useState(false);

  const onSelect = useCallback(
    (c: Chart) => {
      const myself = c.nodes.find((x: Node) => x.id === id);

      if (myself) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    },
    [id]
  );

  useOnSelectionChange({ onChange: onSelect });

  const handleCommentClick = () => {
    setEditmode(true);
  };

  const handleCommentInput = (e: FormEvent<HTMLTextAreaElement>) => {
    setComment(e.currentTarget.value);
  };

  useEffect(() => {
    data.label = comment;
  }, [comment]);

  return (
    <>
      {editmode ? (
        <div style={editStyle}>
          <textarea
            value={comment}
            onChange={handleCommentInput}
            onBlur={() => setEditmode(false)}
            style={textStyle}
          />
          <button onClick={() => setEditmode(false)}>OK</button>
        </div>
      ) : (
        <div
          onDoubleClick={handleCommentClick}
          style={isSelected ? nodeSelectedStyle : nodeStyle}
        >
          {comment}
        </div>
      )}
    </>
  );
};

export default memo(CommentNode);
