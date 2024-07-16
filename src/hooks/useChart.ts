import { Node, Edge } from 'reactflow';
import { useEffect, useState } from 'react';

export type Module = {
	type: string;
	label: string;
	nodes: Node<any>[];
	edges: Edge<any>[];
	id?: string;
};

export type Chart = {
	nodes: Node<any>[];
	edges: Edge<any>[];
	modules?: Module[];
};

const nodesFilter = (x: Node) => {
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
};

const edgesFilter = (x: Edge) => {
	delete x.type;
	if (x.sourceHandle === null) {
		delete x.sourceHandle;
	}
	if (x.targetHandle === null) {
		delete x.targetHandle;
	}

	x.data = {
		...(x.data?.offsetX && { offsetX: x.data?.offsetX }),
		...(x.data?.offsetY && { offsetY: x.data?.offsetY }),
		...(x.data?.sourceOffset && { sourceOffset: x.data?.sourceOffset }),
		...(x.data?.targetOffset && { targetOffset: x.data?.targetOffset }),
	};

	delete x.selected;
	delete x.style;

	return x;
};

const modulesFilter = (x: Module) => {
	x.edges = x.edges.map(edgesFilter);
	x.nodes = x.nodes.map(nodesFilter);
	return x;
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
			nodes: c.nodes.map(nodesFilter),
			edges: c.edges.map(edgesFilter),
			modules: c.modules?.map(modulesFilter),
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
