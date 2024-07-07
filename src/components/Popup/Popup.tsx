import Cross from 'components/Icons/Cross';
import dragAndDrop from 'lib/dragAndDrop';
import { CSSProperties, MutableRefObject, ReactNode, useRef } from 'react';

type PopupProps = {
	title: string;
	onCancel: () => void;
	children: ReactNode;
	style?: CSSProperties;
};

const popupStyle: CSSProperties = {
	border: '1px solid #ccc',
	borderRadius: '10px',
	overflow: 'hidden',
	position: 'absolute',
	width: '400px',
	top: '10vh',
	left: 'calc(50vw - 200px)',
	background: '#fff',
	boxShadow: '3px 3px 15px #00000066',
};

const headerStyle: CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	backgroundColor: '#666',
	color: '#fff',
	padding: '10px',
};

const closeButtonStyle: CSSProperties = {
	border: 'none',
	backgroundColor: 'transparent',
	color: '#fff',
};

const Popup = ({ title, onCancel, children, style }: PopupProps) => {
	const popupRef: MutableRefObject<any> = useRef(null);

	return (
		<div
			ref={popupRef}
			style={{
				...popupStyle,
				...style,
			}}
		>
			<div style={headerStyle} onPointerDown={dragAndDrop(popupRef)}>
				<span
					style={{
						userSelect: 'none',
					}}
				>
					{title}
				</span>
				<button style={closeButtonStyle} onClick={onCancel}>
					<Cross />
				</button>
			</div>
			{children}
		</div>
	);
};

export default Popup;
