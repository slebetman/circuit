import type { NextApiRequest, NextApiResponse } from "next";
import { listCharts } from "lib/charts";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  res.json({
    charts: await listCharts(),
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      return get(req, res);
    default:
      res.status(502).send("Method not supported");
  }
};

export default handler;
