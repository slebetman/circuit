import { Edge } from 'reactflow';
import { InternalCompiler } from './types';

export function xor(comp: InternalCompiler, inputs: Edge[]) {
	const a = comp(inputs[0]);
	const b = comp(inputs[1]);

	// simplifying step in case the values never change
	if (a === b) {
		return 'false';
	}

	return `(${a} !== ${b})`;
}
