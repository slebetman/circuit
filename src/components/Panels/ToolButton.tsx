import { CSSProperties, FC, createElement, useState } from 'react';

type ToolButtonProp = {
	icon?: FC;
	label?: string;
	onClick?: Function;
	actionType?: string;
	title?: string;
	style?: CSSProperties;
};

const ToolButton: FC<ToolButtonProp> = ({
	icon,
	label,
	onClick,
	actionType,
	title,
	style,
}) => {
	const [hover, setHover] = useState(false);

	if (icon === undefined && label === undefined) {
		throw new Error('Requires either an icon or label');
	}

	return (
		<button
			style={{
				backgroundColor: hover ? '#adf' : '#fff',
				border: '1px solid #ccc',
				width: '50px',
				height: '50px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				boxShadow: '1px 3px 5px #00000033',
				fontSize: '10px',
				...style,
			}}
			onClick={() => {
				if (onClick) onClick(actionType);
			}}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			title={title}
		>
			{icon && createElement(icon)}
			{label && <span style={{ userSelect: 'none' }}>{label}</span>}
		</button>
	);
};

export default ToolButton;
