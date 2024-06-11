import { Chart } from "components/hooks/useChart";
import {
  memo,
  FC,
  useState,
  FormEvent,
  CSSProperties,
  useCallback,
  useEffect,
} from "react";
import { NodeProps, Node, useOnSelectionChange, useReactFlow } from "reactflow";

const textStyle: CSSProperties = {
  fontSize: "10px",
  width: "20rem",
  height: "5rem",
};

const nodeStyle: CSSProperties = {
  border: "none",
  fontSize: "10px",
  fontStyle: "italic",
  backgroundColor: "#ffa",
  padding: "2px 5px",
  whiteSpace: "pre-wrap",
};

const nodeSelectedStyle: CSSProperties = {
  ...nodeStyle,
  border: "2px solid black",
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
        <textarea
          value={comment}
          onChange={handleCommentInput}
          onBlur={() => setEditmode(false)}
          style={textStyle}
        />
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
