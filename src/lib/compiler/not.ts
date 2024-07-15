import { Edge } from 'reactflow';
import { InternalCompiler } from './types';

export function not(comp: InternalCompiler, inputs: Edge[]) {
	const a = comp(inputs[0]);

	// simplifying step in case the value never changes
	if (a === undefined) {
		return 'true';
	}

	return `!(${a})`;
}
