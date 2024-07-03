import Cross from "components/Icons/Cross";
import dragAndDrop from "lib/dragAndDrop";
import { CSSProperties, MutableRefObject, ReactNode, useRef } from "react";

type PopupProps = {
  title: string;
  onCancel: () => void;
  children: ReactNode;
};

const popupStyle: CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: "10px",
  overflow: "hidden",
  position: "absolute",
  width: "400px",
  top: "10vh",
  left: "calc(50vw - 200px)",
  background: "#fff",
  boxShadow: "3px 3px 15px #999",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#666",
  color: "#fff",
  padding: "10px",
};

const closeButtonStyle: CSSProperties = {
  border: "none",
  backgroundColor: "transparent",
  color: "#fff",
};

const Popup = ({ title, onCancel, children }: PopupProps) => {
  const popupRef: MutableRefObject<any> = useRef(null);

  return (
    <div
      ref={popupRef}
      onPointerDown={dragAndDrop(popupRef)}
      style={popupStyle}
    >
      <div style={headerStyle}>
        {title}
        <button style={closeButtonStyle} onClick={onCancel}>
          <Cross />
        </button>
      </div>
      {children}
    </div>
  );
};

export default Popup;
