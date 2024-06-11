import type { NextApiRequest, NextApiResponse } from "next";
import { loadChart, saveChart } from "lib/charts";

const post = async (req: NextApiRequest, res: NextApiResponse) => {
  const name = req.query.name as string;
  const chart = req.body;

  await saveChart(name, chart);

  res.json({
    status: "OK",
  });
};

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const name = req.query.name as string;

  res.json(await loadChart(name));
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
