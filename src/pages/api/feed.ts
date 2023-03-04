import { NextApiRequest, NextApiResponse } from "next";
import { readdirSync, readFileSync, statSync } from "fs";
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
            href: "http://mystation.lan",
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
    feed_url: "http://mystation.lan",
    site_url: "http://mystation.lan",
    custom_namespaces: {
      itunes: "http://www.itunes.com/dtds/podcast-1.0.dtd",
    },
    language: "ja-jp",
  });
  dirs.reverse().forEach((dir) => {
    const meta = JSON.parse(
      readFileSync(`/mnt/data/output/${dir}/meta.json`).toString()
    );
    const stat = statSync(`/mnt/data/output/${dir}/a.mp3`);
    feed.item({
      title: meta.title,
      enclosure: {
        url: `http://${req.headers.host?.split(":")[0]}/output/${dir}/a.mp3`,
        size: stat.size,
      },
      description: "",
      url: `http://${req.headers.host?.split(":")[0]}/output/${dir}/a.mp3`,
      date: parse(meta.ft, "yyyyMMddHHmmss", new Date()),
    });
  });
  res.status(200).send(feed.xml());
}
