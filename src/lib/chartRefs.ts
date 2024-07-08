import { Chart } from 'hooks/useChart';

let chartRef: Chart = { nodes: [], edges: [], modules: [] };

export const setChartRef = (ref: Chart) => {
	chartRef.nodes = ref.nodes;
	chartRef.edges = ref.edges;
	chartRef.modules = ref.modules;
};

export const getChartRef = () => chartRef;
