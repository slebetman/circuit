import type { NextApiRequest, NextApiResponse } from "next";
import { listCharts } from "lib/charts";

const get = async (req: NextApiRequest, res: NextApiResponse) => {
  let {dir} = req.query;

  if (dir instanceof Array) {
    dir = dir[0];
  }

  res.json({
    charts: await listCharts(dir),
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
