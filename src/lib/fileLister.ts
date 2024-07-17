import fs from 'fs/promises';
import path from 'path';
import { chartsdir } from './files';

export type FileTypes = 'file' | 'dir';

export type DirListing = {
	name: string;
	type: FileTypes;
};

export const listFiles = async () => {
	return (await fs.readdir(chartsdir(), { withFileTypes: true }))
		.filter(
			(x) => (x.isFile() && x.name.match(/\.json$/)) || x.isDirectory(),
		)
		.map((x) => {
			if (x.isFile()) {
				return {
					name: path.basename(x.name, '.json'),
					type: 'file',
				} as DirListing;
			} else if (x.isDirectory()) {
				return {
					name: x.name,
					type: 'dir',
				} as DirListing;
			} else {
				throw new Error('Should not get here');
			}
		})
		.toSorted((a, b) => {
			const typeDiff = a.type?.localeCompare(b.type);

			if (typeDiff !== 0) return typeDiff;

			return a.name.localeCompare(b.name);
		});
};
