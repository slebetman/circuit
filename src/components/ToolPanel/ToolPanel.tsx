import { FC } from 'react';
import { Panel, PanelPosition } from 'reactflow';
import ToolButton from './ToolButton';
import FolderOpen from 'components/Icons/FolderOpen';
import Code from 'components/Icons/Code';
import FileNew from 'components/Icons/FileNew';
import FileSave from 'components/Icons/FileSave';
import Play from 'components/Icons/Play';
import ToggleButton from './ToggleButton';
import Pause from 'components/Icons/Pause';
import ArrowBack from 'components/Icons/ArrowBack';
import Box from 'components/Icons/Box';
import Network from 'components/Icons/Network';

type ActionType = 'nodes' | 'modules';

type ToolPanelProp = {
	mode: 'chart' | 'module';
	position: PanelPosition;
	handlers: ToolActionHandlers;
	simRunning: boolean;
};

type ToolActionHandlers = {
	open?: Function;
	save?: Function;
	new?: Function;
	compile?: Function;
	run?: Function;
	tools?: (actionType: ActionType) => void;
	backToChart?: Function;
};

const Divider = () => <div style={{ userSelect: 'none' }}>&nbsp;</div>;

const ToolPanel: FC<ToolPanelProp> = ({
	mode,
	position,
	handlers,
	simRunning,
}) => {
	if (mode === 'chart')
		return (
			<Panel position={position}>
				<ToolButton
					icon={FileNew}
					onClick={handlers.new}
					title='New circuit'
				/>
				<ToolButton
					icon={FolderOpen}
					onClick={handlers.open}
					title='Open circuit'
				/>
				<ToolButton
					icon={FileSave}
					onClick={handlers.save}
					title='Save circuit'
				/>
				<Divider />
				<ToolButton
					icon={Network}
					label='Nodes'
					onClick={handlers.tools}
					actionType='nodes'
					title='Nodes pallete'
				/>
				<ToolButton
					icon={Box}
					label='Modules'
					onClick={handlers.tools}
					actionType='modules'
					title='Modules pallete'
				/>
				<Divider />
				<ToolButton
					icon={Code}
					onClick={handlers.compile}
					title='Compile circuit expression'
				/>
				<ToggleButton
					icon={Play}
					active={simRunning}
					activeIcon={Pause}
					onStateChange={handlers.run}
					title='Simulation'
				/>
			</Panel>
		);
	else
		return (
			<Panel position={position}>
				<ToolButton
					icon={ArrowBack}
					onClick={handlers.backToChart}
					title='Back'
				/>
				<ToolButton
					label='Nodes'
					onClick={handlers.tools}
					actionType='nodes'
					title='Nodes pallete'
				/>
				<Divider />
				<ToolButton
					icon={Code}
					onClick={handlers.compile}
					title='Compile circuit expression'
				/>
			</Panel>
		);
};

export default ToolPanel;
