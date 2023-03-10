import { NextApiRequest, NextApiResponse } from "next";
import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import RSS from "rss";
import { parse } from "date-fns";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dirs = readdirSync("/mnt/data/output").filter((name) =>
    name.match(/\d{14}\-([A-Z]|\-)+/)
  );
  const feed = new RSS({
    title: "myStation",
    description: "desc",
    custom_elements: [
      {
        "itunes:image": {
          _attr: {
            href: process.env.DOMAIN,
          },
        },
      },
      {
        "itunes:category": [
          {
            _attr: {
              text: "category",
            },
          },
        ],
      },
      {
        "itunes:explicit": "false",
      },
    ],
    feed_url: process.env.DOMAIN!,
    site_url: process.env.DOMAIN!,
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
    language: "ja-jp",
  });
  dirs.reverse().forEach((dir) => {
    const metaPath = `/mnt/data/output/${dir}/meta.json`;
    const audioPath = `/mnt/data/output/${dir}/a.mp3`;
    if (existsSync(metaPath) && existsSync(audioPath)) {
      const meta = JSON.parse(readFileSync(metaPath).toString());
      const stat = statSync(audioPath);
      feed.item({
        title: meta.title,
        enclosure: {
          url: `${process.env.ASSET_DOMAIN}/output/${dir}/a.mp3`,
          size: stat.size,
        },
        description: "",
        url: `${process.env.ASSET_DOMAIN}/output/${dir}/a.mp3`,
        date: parse(meta.ft, "yyyyMMddHHmmss", new Date()),
      });
    }
  });
  res.status(200).send(feed.xml());
}
