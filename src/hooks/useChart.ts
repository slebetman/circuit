import { Node, Edge } from 'reactflow';
import { useEffect, useState } from 'react';

export type Module = {
	type: string;
	label: string;
	nodes: Node<any>[];
	edges: Edge<any>[];
};

export type Chart = {
	nodes: Node<any>[];
	edges: Edge<any>[];
	modules?: Module[];
};

const useChart = () => {
	const [name, setName] = useState<string>('');
	const [isBusy, setIsBusy] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);
	const [chart, setChart] = useState<Chart | null>(null);

	const load = async (filename: string) => {
		setName(filename);
		setIsBusy(true);

		try {
			const res = await fetch(`/api/charts/${filename}`);
			const chart = await res.json();
			setChart(chart);
		} catch (err) {
			setError(err as Error);
		}

		setIsBusy(false);
	};

	const save = async (filename: string, c: Chart) => {
		if (!c) return;
		setIsBusy(true);
		const chartToSave = {
			nodes: c.nodes.map((x) => {
				delete x.positionAbsolute;
				delete x.width;
				delete x.height;
				delete x.selected;
				delete x.dragging;

				if (x.data && Object.keys(x.data).length === 0) {
					delete x.data;
				} else if (x.data) {
					delete x.data.on;
					delete x.data.sim;
				}

				if (x.type === 'module' && x.data) {
					x.data = {
						type: x.data.type,
					};
				}

				return x;
			}),
			edges: c.edges.map((x) => {
				delete x.type;
				if (x.sourceHandle === null) {
					delete x.sourceHandle;
				}
				if (x.targetHandle === null) {
					delete x.targetHandle;
				}

				x.data = {
					offsetX: x.data?.offsetX || 0,
					offsetY: x.data?.offsetY || 0,
					sourceOffset: x.data?.sourceOffset || 0,
					targetOffset: x.data?.targetOffset || 0,
				};

				delete x.selected;
				delete x.style;

				return x;
			}),
			modules: c.modules,
		};
		try {
			if (!filename) {
				throw new Error('Chart has no name!');
			}

			await fetch(`/api/charts/${filename}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(chartToSave),
			});
		} catch (err) {
			setError(err as Error);
		}
		setName(filename);
		setChart(chartToSave);
		setIsBusy(false);
	};

	useEffect(() => {
		(async () => {})();
	}, [chart]);

	const clearError = () => {
		setError(null);
	};

	return {
		isBusy,
		name,
		setName: (n: string) => setName(n),
		error,
		chart,
		load,
		save,
		clearError,
	};
};

export default useChart;
