import And from "components/Icons/And";
import Not from "components/Icons/Not";
import Or from "components/Icons/Or";
import Xor from "components/Icons/Xor";
import { FC, useState } from "react";
import { Panel, PanelPosition } from "reactflow";
import ToolButton from "./ToolButton";
import FolderOpen from "components/Icons/FolderOpen";
import FloppyDisk from "components/Icons/FloppyDisk";
import Code from "components/Icons/Code";
import File from "components/Icons/File";

type ActionType = 'nodes' | 'modules';

type ToolPanelProp = {
	position: PanelPosition;
	handlers: ToolActionHandlers;
}

type ToolActionHandlers = {
	open?: Function;
	save?: Function;
	new?: Function;
	compile?: Function;
	createNode?: (actionType: ActionType) => void;
}

const ToolPanel: FC<ToolPanelProp> = ({ position, handlers }) => {
	const [isOpen, setIsOpen] = useState(true);

	return <Panel position={position}>
		<ToolButton icon={File} onClick={handlers.new} />
		<ToolButton icon={FolderOpen} onClick={handlers.open} />
		<ToolButton icon={FloppyDisk} onClick={handlers.save} />
		<div>&nbsp;</div>
		<ToolButton label="Nodes" onClick={handlers.createNode} actionType="nodes" />
		<ToolButton label="Modules" onClick={handlers.createNode} actionType="modules" />
		<div>&nbsp;</div>
		<ToolButton icon={Code} onClick={handlers.compile} />
	</Panel>
}

export default ToolPanel;