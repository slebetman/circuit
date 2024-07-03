import { FC, ReactNode, createElement } from "react";

type NodeButtonProp = {
	icon: FC,
	onClick?: Function;
	actionType?: string;
}

const NodeButton: FC<NodeButtonProp> = ({ icon, onClick, actionType }) => (
	<button
		style={{
			backgroundColor: '#fff',
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
	>
		{createElement(icon)}
	</button>
)

export default NodeButton;