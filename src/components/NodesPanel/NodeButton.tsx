import { FC, createElement, useState } from "react";

type NodeButtonProp = {
	icon: FC,
	onClick?: Function;
	actionType?: string;
}

const NodeButton: FC<NodeButtonProp> = ({ icon, onClick, actionType }) => {
	const [hover, setHover] = useState(false);

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
		}}
		onClick={() => {
			if (onClick) onClick(actionType);
		}}
		onMouseEnter={() => setHover(true)}
		onMouseLeave={() => setHover(false)}
	>
		{createElement(icon)}
	</button>
}

export default NodeButton;