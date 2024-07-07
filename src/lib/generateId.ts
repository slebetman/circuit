import { nanoid } from "nanoid";
import { ReactFlowInstance } from "reactflow";

const generateId = (instance: ReactFlowInstance | null) => {
	let ok = false;
	let id;
	// retry if id is duplicate
	while (!ok) {
		id = nanoid(5);
		if (!(instance?.getNode(id))) {
			ok = true;
		}
	}
	return id;
};

export default generateId;