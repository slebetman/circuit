import Popup from "components/Popup/Popup";
import { useState } from "react";

type SaveDialogProps = {
  onSubmit: (file: string) => void;
  onCancel: () => void;
  name: string;
};

const SaveDialog = ({ name, onSubmit, onCancel }: SaveDialogProps) => {
  const [fileName, setFileName] = useState(name);

  return (
    <Popup title="Save File" onCancel={onCancel}>
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
    </Popup>
  );
};

export default SaveDialog;
