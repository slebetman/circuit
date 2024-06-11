import findRoot from "find-root";
import path from "path";

export const projectdir = () => {
  const root = findRoot(__dirname);
  return path.normalize(path.join(root, ".."));
};

export const chartsdir = () => {
  return path.normalize(path.join(projectdir(), "charts"));
};
