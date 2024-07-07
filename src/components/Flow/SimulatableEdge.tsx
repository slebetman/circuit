import { getSmoothStepPath, SmoothStepEdgeProps } from "reactflow";

export function SimulatableEdge(props: SmoothStepEdgeProps) {
  const {
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    style,
    data,
    selected,
  } = props;

  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 5,
  });

  return (
    <path
      style={style}
      stroke={
        data.on
          ? "#6c6"
          : data.on === false
          ? "#ccc"
          : selected
          ? "#000"
          : "#ccc"
      }
      fill="transparent"
      d={path}
    />
  );
}
