import And from "components/Icons/And";
import Not from "components/Icons/Not";
import Or from "components/Icons/Or";
import Xor from "components/Icons/Xor";
import Popup from "components/Popup/Popup";
import ToolButton from "components/ToolPanel/ToolButton";

type NodesDialogProps = {
  onClick: (actionType: string) => void;
  onClose: () => void;
};

const NodesDialog = ({ onClick, onClose }: NodesDialogProps) => {
  return (
    <Popup title="Nodes"
      onCancel={onClose}
      style={{
			width: 'fit-content',
			top: '16px',
			left: '80px'
      }}
	>
      <div
        style={{
          width: '106px',
          padding: "2px",
          display: "flex",
          gap: "2px",
          flexWrap: 'wrap',
        }}
      >
        <ToolButton icon={And} onClick={onClick} actionType="and"/>
		<ToolButton icon={Or} onClick={onClick} actionType="or"/>
		<ToolButton icon={Xor} onClick={onClick} actionType="xor"/>
		<ToolButton icon={Not} onClick={onClick} actionType="not"/>
		<ToolButton label="Input" onClick={onClick} actionType="in"/>
		<ToolButton label="Output" onClick={onClick} actionType="out"/>
		<ToolButton label="Comment" onClick={onClick} actionType="comment"/>
      </div>
    </Popup>
  );
};

export default NodesDialog;
