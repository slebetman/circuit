import { FC } from 'react';
import { Module } from '../../../hooks/useChart';
import ToolButton from 'components/Panels/ToolButton';
import Box from 'components/Icons/Box';

type ModulesListProps = {
	modules: Module[];
	onSelect: (actionType: string) => void;
	editModule?: (type: string) => void;
	deleteModule?: (type: string) => void;
};

export const ModulesList: FC<ModulesListProps> = ({
	modules,
	onSelect,
	editModule,
	deleteModule,
}) => {
	return (
		<div
			style={{
				padding: '2px',
				display: 'flex',
				gap: '2px',
				flexDirection: 'column',
			}}
		>
			{modules.map((module, idx) => (
				<div
					key={`${module.type}${idx}`}
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '2px',
					}}
				>
					<ToolButton
						icon={Box}
						label={module.label}
						onClick={onSelect}
						actionType={`module:${module.label}:${module.type}`}
						style={{
							height: '50px',
							width: '100px',
						}}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: '2px',
							justifyContent: 'center',
						}}
					>
						<button onClick={() => editModule?.(module.type)}>
							Edit
						</button>
						<button onClick={() => deleteModule?.(module.type)}>
							Delete
						</button>
					</div>
				</div>
			))}
		</div>
	);
};
