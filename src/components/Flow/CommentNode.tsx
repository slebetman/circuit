import { memo, FC, useState, FormEvent, KeyboardEvent } from "react";
import { NodeProps } from "reactflow";

const CommentNode: FC<NodeProps> = ({ data }) => {
  const [editmode, setEditmode] = useState(false);
  const [comment, setComment] = useState(data.label);

  const handleCommentClick = () => {
    setEditmode(true);
  };

  const handleCommentInput = (e: FormEvent<HTMLInputElement>) => {
    setComment(e.currentTarget.value);
  };

  const handleCommentKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      setEditmode(false);
    }
  };

  return (
    <>
      {editmode ? (
        <input
          type="text"
          value={comment}
          onChange={handleCommentInput}
          onKeyUp={handleCommentKey}
          onBlur={() => setEditmode(false)}
        />
      ) : (
        <div onDoubleClick={handleCommentClick}>{comment}</div>
      )}
    </>
  );
};

export default memo(CommentNode);
