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
      `docker run -v /mnt/data/output:/output radigo rec -o=mp3 -id=${body.id} -s=${body.ft}`,
      () => {
        const filename = `${body.ft}-${body.id}`;
        execSync(`mkdir -p /mnt/data/output/${filename}`);
        execSync(
          `mv /mnt/data/output/${filename}.mp3 /mnt/data/output/${filename}/a.mp3`
        );
        writeFileSync(`/mnt/data/output/${filename}/meta.json`, req.body);
        res.status(200).json({ ok: true });
      }
    );
  } else {
    res.status(401).json({ ok: false });
  }
}
