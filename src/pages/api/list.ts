import { existsSync, readdirSync, readFileSync } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dirs = readdirSync("/mnt/data/output").filter((name) =>
    name.match(/\d{14}\-([A-Z]|\-)+/)
  );
  let files: {
    title: string;
    url: string;
    date: Date;
  }[] = [];
  dirs.reverse().forEach((dir) => {
    const metaPath = `/mnt/data/output/${dir}/meta.json`;
    const audioPath = `/mnt/data/output/${dir}/a.mp3`;
    if (existsSync(metaPath) && existsSync(audioPath)) {
      const meta = JSON.parse(readFileSync(metaPath).toString());
      files.push({
        title: meta.title,
        url: `${process.env.ASSET_DOMAIN}/output/${dir}/a.mp3`,
        date: parse(meta.ft, "yyyyMMddHHmmss", new Date()),
      });
    }
  });
  res.status(200).json({ ok: true, files });
}
