import And from "components/Icons/And";
import Not from "components/Icons/Not";
import Or from "components/Icons/Or";
import Xor from "components/Icons/Xor";
import { FC, useState } from "react";
import { Panel, PanelPosition } from "reactflow";
import NodeButton from "./NodeButton";
import FolderOpen from "components/Icons/FolderOpen";
import FloppyDisk from "components/Icons/FloppyDisk";

type NodesPanelProp = {
	position: PanelPosition;
	handlers: NodesActionHandlers;
}

type NodesActionHandlers = {
	open?: Function;
	save?: Function;
	createNode?: Function;
}

const NodesPanel: FC<NodesPanelProp> = ({ position, handlers }) => {
	const [isOpen, setIsOpen] = useState(true);

	return <Panel position={position}>
		<NodeButton icon={FolderOpen} onClick={handlers.open} />
		<NodeButton icon={FloppyDisk} onClick={handlers.save} />
		<div>&nbsp;</div>
		<NodeButton icon={And} onClick={handlers.createNode} actionType="and" />
		<NodeButton icon={Or} onClick={handlers.createNode} actionType="or" />
		<NodeButton icon={Xor} onClick={handlers.createNode} actionType="xor" />
		<NodeButton icon={Not} onClick={handlers.createNode} actionType="not" />
	</Panel>
}

export default NodesPanel;