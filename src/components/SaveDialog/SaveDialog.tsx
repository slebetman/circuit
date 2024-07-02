import { useState } from "react";

type SaveDialogProps = {
  onSubmit: (file: string) => void;
  onCancel: () => void;
  name: string;
};

const SaveDialog = ({ name, onSubmit, onCancel }: SaveDialogProps) => {
  const [fileName, setFileName] = useState(name);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        overflow: "hidden",
        position: "absolute",
        width: "400px",
        top: "10vh",
        left: "calc(50vw - 200px)",
        background: "#fff",
        boxShadow: "3px 3px 15px #999",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#666",
          color: "#fff",
          padding: "10px",
        }}
      >
        Save File
        <button onClick={onCancel}>Cancel</button>
      </div>
      <div
        style={{
          padding: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          style={{
            width: "300px",
          }}
          value={fileName}
          onChange={(e) => {
            setFileName(e.currentTarget.value);
          }}
        />
        <button onClick={() => onSubmit(fileName)}>Save</button>
      </div>
    </div>
  );
};

export default SaveDialog;
