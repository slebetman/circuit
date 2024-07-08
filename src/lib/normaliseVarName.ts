export type VarNameOptions = {
	prefix?: string;
	withThis?: boolean;
};

const varName = (name: string, opt?: VarNameOptions) => {
	let normalised = name.replace(/[- ]+/g, '_');

	if (opt?.prefix) {
		normalised = `${opt.prefix}_${normalised}`;
	}

	if (opt?.withThis) {
		normalised = `this["${normalised}"]`;
	}

	return normalised;
};

export default varName;
