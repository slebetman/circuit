import { memo, FC, useState, FormEvent, CSSProperties } from "react";
import { NodeProps } from "reactflow";

const textStyle: CSSProperties = {
  fontSize: "10px",
  width: "20rem",
  height: "5rem",
};

const CommentNode: FC<NodeProps> = ({ data }) => {
  const [editmode, setEditmode] = useState(false);
  const [comment, setComment] = useState(data.label);

  const handleCommentClick = () => {
    setEditmode(true);
  };

  const handleCommentInput = (e: FormEvent<HTMLTextAreaElement>) => {
    setComment(e.currentTarget.value);
  };

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
        <div onDoubleClick={handleCommentClick}>{comment}</div>
      )}
    </>
  );
};

export default memo(CommentNode);
