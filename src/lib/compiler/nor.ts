import { Edge } from 'reactflow';
import { InternalCompiler } from './types';

export function nor(comp: InternalCompiler, inputs: Edge[]) {
	const a = comp(inputs[0]);
	const b = comp(inputs[1]);

	// simplifying step in case one of the values never changes
	switch (a) {
		case undefined:
		case 'false':
			return `!(${b})`;
		case 'true':
			return 'false';
	}
	switch (b) {
		case undefined:
		case 'false':
			return `!(${a})`;
		case 'true':
			return 'false';
	}

	return `!(${a} || ${b})`;
}
