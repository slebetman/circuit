import File from "components/Icons/File";
import Popup from "components/Popup/Popup";
import useChartList from "hooks/useChartList";
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
    <Popup title="Open File" onCancel={onCancel}>
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
    </Popup>
  );
};

export default FilePicker;
