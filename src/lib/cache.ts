function cache<t>() {
	const items: Record<string, t> = {};

	return {
		clear: () => {
			for (const key in items) {
				delete items[key];
			}
		},
		set: (key: string, val: t) => (items[key] = val),
		get: (key: string) => items[key],
	};
}

export default cache;
