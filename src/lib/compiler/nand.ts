import { Edge } from 'reactflow';
import { InternalCompiler } from './types';

export function nand(comp: InternalCompiler, inputs: Edge[]) {
	const a = comp(inputs[0]);
	const b = comp(inputs[1]);

	// simplifying step in case one of the values never changes
	switch (a) {
		case undefined:
		case 'false':
			return 'true';
		case 'true':
			return `!(${b})`;
	}
	switch (b) {
		case undefined:
		case 'false':
			return 'true';
		case 'true':
			return `!(${a})`;
	}

	return `!(${a} && ${b})`;
}
