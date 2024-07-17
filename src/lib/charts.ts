import fs from 'fs/promises';
import { chartsdir } from './files';
import path from 'path';
import { listFiles } from './fileLister';

const chartFileName = (name: string) => path.join(chartsdir(), `${name}.json`);

export const listCharts = () => {
	return listFiles();
};

export const loadChart = async (name: string) => {
	return JSON.parse(await fs.readFile(chartFileName(name), 'utf8'));
};

export const saveChart = async (name: string, chart: any) => {
	return await fs.writeFile(
		chartFileName(name),
		JSON.stringify(chart, null, 2),
	);
};
