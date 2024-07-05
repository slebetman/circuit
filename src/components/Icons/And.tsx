import { Icon } from "./types";

const And:Icon = ({selected}) => (
  <svg
    width="35px"
    height="21px"
    viewBox="0 0 35 21"
    version="1.1"
    id="svg1"
    fill="#fff"
    stroke="#000"
    strokeWidth={selected? 2 : 1}
  >
    <defs id="defs1" />
    <g id="layer1">
      <path id="rect1" d="m 9,1 v 18 h 10 c 5,0 9,-4 9,-9 0,-5 -4,-9 -9,-9 z" />
      <path d="M 0,6 H 9" id="path1" />
      <path d="M 0,15 H 9" id="path1-7" />
      <path d="M 28,10 H 35" id="path1-9" />
    </g>
  </svg>
);

export default And;
