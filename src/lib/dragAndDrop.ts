import { MutableRefObject, PointerEvent } from 'react';

const dragAndDrop =
	(dialogRef: MutableRefObject<HTMLElement>) => (e: PointerEvent<HTMLElement>) => {
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
			const y = origin.y + e.clientY - origin.clientY;
			const x = origin.x + e.clientX - origin.clientX;

			if (y > 1 && (y + dialogRef.current.offsetHeight) < (window.innerHeight - 1)) {
				dialogRef.current.style.top = `${y}px`;
			}
			if (x > 1 && (x + dialogRef.current.offsetWidth) < (window.innerWidth - 1)) {
				dialogRef.current.style.left = `${x}px`;
			}

			e.stopPropagation();
			e.preventDefault();
		};
	};

export default dragAndDrop;
