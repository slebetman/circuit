const varName = (name:string, prefix?: string) => {
	let normalised = name.replace(/[- ]+/g,'_');

	if (prefix) {
		normalised = `${prefix}.${normalised}`;
	}

	return normalised;
}

export default varName;