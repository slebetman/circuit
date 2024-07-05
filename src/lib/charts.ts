import fs from "fs/promises";
import { chartsdir } from "./files";
import path from "path";

const chartFileName = (name: string) => path.join(chartsdir(), `${name}.json`);

export const listCharts = async () => {
  return (await fs.readdir(chartsdir())).map(x => path.basename(x, '.json'));
};

export const loadChart = async (name: string) => {
  return JSON.parse(await fs.readFile(chartFileName(name), "utf8"));
};

export const saveChart = async (name: string, chart: any) => {
  return await fs.writeFile(
    chartFileName(name),
    JSON.stringify(chart, null, 2)
  );
};
