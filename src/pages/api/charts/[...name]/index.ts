import type { NextApiRequest, NextApiResponse } from "next";
import { loadChart, saveChart } from "lib/charts";
import path from "path";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  let name = req.query.name;
  const chart = req.body;

  if (typeof name === 'string') name = [name];
  
  if (name) await saveChart(path.join(...name), chart);

  res.json({
    status: "OK",
  });
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  let name = req.query.name;

  if (typeof name === 'string') name = [name];

  if (name) res.json(await loadChart(path.join(...name)));
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return get(req, res);
    case "POST":
      return post(req, res);
    default:
      res.status(502).send("Method not supported");
  }
};

export default handler;
