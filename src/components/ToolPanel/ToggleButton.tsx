import { FC, createElement, useState } from "react";

type ToggleButtonProp = {
  icon?: FC;
  activeIcon?: FC;
  label?: string;
  onStateChange?: Function;
  title?: string;
  initialState?: boolean;
};

const ToggleButton: FC<ToggleButtonProp> = ({
  icon,
  activeIcon,
  label,
  onStateChange,
  title,
  initialState,
}) => {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(initialState || false);

  if (icon === undefined && label === undefined) {
    throw new Error("Requires either an icon or label");
  }

  return (
    <button
      style={{
        backgroundColor: hover
          ? active
            ? "#6ce"
            : "#adf"
          : active
            ? "#afc"
            : "#fff",
        border: "1px solid #ccc",
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "1px 3px 10px #ccc",
        fontSize: "10px",
      }}
      onClick={() => {
        if (onStateChange) onStateChange(!active);
        setActive((a) => !a);
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={title}
    >
      {icon ? (
        active && activeIcon ? (
          createElement(activeIcon)
        ) : (
          createElement(icon)
        )
      ) : (
        <span style={{ userSelect: "none" }}>{label}</span>
      )}
    </button>
  );
};

export default ToggleButton;
