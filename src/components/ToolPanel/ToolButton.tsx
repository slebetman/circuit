import { FC, createElement, useState } from "react";

type ToolButtonProp = {
	icon?: FC,
	label?: string,
	onClick?: Function;
	actionType?: string;
	title?: string;
}

const ToolButton: FC<ToolButtonProp> = ({ icon, label, onClick, actionType, title }) => {
	const [hover, setHover] = useState(false);

	if (icon === undefined && label === undefined) {
		throw new Error('Requires either an icon or label');
	}

	return <button
		style={{
			backgroundColor: hover ? '#adf' : '#fff',
			border: '1px solid #ccc',
			width: '50px',
			height: '50px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			cursor: 'pointer',
			boxShadow: '1px 3px 10px #ccc',
			fontSize: '10px',
		}}
		onClick={() => {
			if (onClick) onClick(actionType);
		}}
		onMouseEnter={() => setHover(true)}
		onMouseLeave={() => setHover(false)}
		title={title}
	>
		{icon ? createElement(icon) : <span style={{userSelect:'none'}}>{label}</span>}
	</button>
}

export default ToolButton;