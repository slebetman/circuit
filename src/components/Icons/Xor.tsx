import { Icon } from "./types";

const Xor: Icon = ({ selected }) => (
  <svg
    width="35px"
    height="21px"
    viewBox="0 0 35 21"
    version="1.1"
    id="svg1"
    fill="#fff"
    stroke="#000"
    strokeWidth={selected ? 2 : 1}
  >
    <g id="layer1">
      <path
        id="rect1"
        d="m 11,1 c 4,6 4,12 0,18 H 16 C 21,19 29,14 29,10 29,6 21,1 16,1 Z"
      />
      <path d="M 8,1 C 12,7 12,13 8,19" id="path1-5" />
      <path d="M 0,6 H 10" id="path1" />
      <path d="M 0,15 H 10" id="path1-7" />
      <path d="M 29,10 H 35" id="path1-9" />
    </g>
  </svg>
);

export default Xor;
