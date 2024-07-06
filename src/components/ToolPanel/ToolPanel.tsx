import { FC } from "react";
import { Panel, PanelPosition } from "reactflow";
import ToolButton from "./ToolButton";
import FolderOpen from "components/Icons/FolderOpen";
import Code from "components/Icons/Code";
import FileNew from "components/Icons/FileNew";
import FileSave from "components/Icons/FileSave";
import Play from "components/Icons/Play";
import ToggleButton from "./ToggleButton";
import Pause from "components/Icons/Pause";

type ActionType = "nodes" | "modules";

type ToolPanelProp = {
  position: PanelPosition;
  handlers: ToolActionHandlers;
};

type ToolActionHandlers = {
  open?: Function;
  save?: Function;
  new?: Function;
  compile?: Function;
  run?: Function;
  createNode?: (actionType: ActionType) => void;
};

const Divider = () => <div style={{ userSelect: "none" }}>&nbsp;</div>;

const ToolPanel: FC<ToolPanelProp> = ({ position, handlers }) => (
  <Panel position={position}>
    <ToolButton icon={FileNew} onClick={handlers.new} title="New circuit" />
    <ToolButton
      icon={FolderOpen}
      onClick={handlers.open}
      title="Open circuit"
    />
    <ToolButton icon={FileSave} onClick={handlers.save} title="Save circuit" />
    <Divider />
    <ToolButton
      label="Nodes"
      onClick={handlers.createNode}
      actionType="nodes"
      title="Nodes pallete"
    />
    <ToolButton
      label="Modules"
      onClick={handlers.createNode}
      actionType="modules"
      title="Modules pallete"
    />
    <Divider />
    <ToolButton
      icon={Code}
      onClick={handlers.compile}
      title="Compile circuit expression"
    />
    <ToggleButton
      icon={Play}
      activeIcon={Pause}
      onStateChange={handlers.run}
      title="Simulation"
    />
  </Panel>
);

export default ToolPanel;
