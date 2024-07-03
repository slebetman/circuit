import { MutableRefObject, PointerEvent } from "react";

const dragAndDrop =
  (ref: MutableRefObject<any>) => (e: PointerEvent<HTMLElement>) => {
    let origin = {
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop,
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

        ref.current.style.top = `${y}px`;
        ref.current.style.left = `${x}px`;

        e.stopPropagation();
        e.preventDefault();
      }
    };
  };

export default dragAndDrop;
