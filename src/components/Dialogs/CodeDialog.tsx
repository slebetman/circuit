import Popup from "components/Popup/Popup";

type CodeDialogProps = {
  onClose: () => void;
  code: string[];
};

const CodeDialog = ({ code, onClose }: CodeDialogProps) => {
  return (
    <Popup title="Compiled Expressions"
      onCancel={onClose}
      style={{
			width: '800px',
			minHeight: '300px',
			left: 'calc(50% - 400px)',
			overflow: 'auto',
      }}
	>
      <pre
	  	style={{
			whiteSpace: 'pre-wrap',
			padding: '5px 10px',
			fontSize: '14px',
		}}
	  >
		{code.join('\n\n')}
	  </pre>
    </Popup>
  );
};

export default CodeDialog;
