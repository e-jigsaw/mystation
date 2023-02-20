import { NextApiRequest, NextApiResponse } from "next";
import { execSync, exec } from "child_process";
import { writeFileSync } from "fs";

type Body = {
  ft: string;
  title: string;
  id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body) as Body;
  if (body.ft.match(/\d{14}/) && body.id.match(/([A-Z]|\-)+/)) {
    exec(
      `docker run -v "$(pwd)"/output:/output radigo rec -id=${body.id} -s=${body.ft}`,
      () => {
        const filename = `${body.ft}-${body.id}`;
        execSync(`mkdir -p output/${filename}`);
        execSync(`mv output/${filename}.aac output/${filename}/a.aac`);
        writeFileSync(`output/${filename}/meta.json`, req.body);
        res.status(200).json({ ok: true });
      }
    );
  } else {
    res.status(401).json({ ok: false });
  }
}
