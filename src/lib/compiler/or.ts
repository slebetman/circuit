import { Edge } from 'reactflow';
import { InternalCompiler } from './types';

export function or(comp: InternalCompiler, inputs: Edge[]) {
	const a = comp(inputs[0]);
	const b = comp(inputs[1]);

	// simplifying step in case one of the values never changes
	switch (a) {
		case undefined:
		case 'false':
			return b;
		case 'true':
			return 'true';
	}
	switch (b) {
		case undefined:
		case 'false':
			return a;
		case 'true':
			return 'true';
	}

	return `(${a} || ${b})`;
}
