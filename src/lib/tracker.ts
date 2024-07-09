const tracker = () => {
	const items: Record<string,boolean> = {};

	return {
		clear: () => {
			for (const key in items) {
				delete items[key];
			}
		},
		set: (key:string) => items[key] = true,
		check: (key:string) => items[key],
	}
}

export default tracker;