const tracker = () => {
	const items: Record<string, number> = {};

	return {
		clear: () => {
			for (const key in items) {
				delete items[key];
			}
		},
		set: (key: string) => (items[key] = (items[key] || 0) + 1),
		check: (key: string) => items[key] || 0,
	};
};

export default tracker;
