import { MutableRefObject, PointerEvent } from "react";

const dragAndDrop =
  (dialogRef: MutableRefObject<any>) => (e: PointerEvent<HTMLElement>) => {
    let origin = {
      x: dialogRef.current.offsetLeft,
      y: dialogRef.current.offsetTop,
      clientX: e.clientX,
      clientY: e.clientY,
    };

    window.onpointerup = () => {
      window.onpointermove = null;
      window.onpointerup = null;
    };

    window.onpointermove = (e) => {
      if (origin) {
        const y = origin.y + e.clientY - origin.clientY;
        const x = origin.x + e.clientX - origin.clientX;

        dialogRef.current.style.top = `${y}px`;
        dialogRef.current.style.left = `${x}px`;

        e.stopPropagation();
        e.preventDefault();
      }
    };
  };

export default dragAndDrop;
