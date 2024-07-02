import File from "components/Icons/File";
import useChartList from "components/hooks/useChartList";
import { useEffect, useState } from "react";

type FilePickerProps = {
  onSelect: (file: string) => void;
  onCancel: () => void;
};

const FilePicker = ({ onSelect, onCancel }: FilePickerProps) => {
  const chartList = useChartList();

  useEffect(() => {
    chartList.load();
  }, []);

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
        Open File
        <button onClick={onCancel}>Cancel</button>
      </div>
      <div
        style={{
          padding: "10px",
        }}
      >
        <table
          style={{
            width: "100%",
          }}
        >
          <tbody>
            {chartList.files?.map((f, i) => (
              <tr key={i}>
                <td>
                  <File />
                </td>
                <td
                  style={{
                    minWidth: "300px",
                  }}
                >
                  {f}
                </td>
                <td>
                  <button onClick={() => onSelect(f)}>Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilePicker;
