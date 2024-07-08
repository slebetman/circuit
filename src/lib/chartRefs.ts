import { Chart } from 'hooks/useChart';

let chartRef: Chart = { nodes: [], edges: [], modules: [] };

export const setChartRef = (ref: Chart) => (chartRef = { ...ref });

export const getChartRef = () => chartRef;
