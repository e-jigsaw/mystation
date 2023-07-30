import { client } from "./getClient";
import { getObject } from "./getObject";
import RSS from "rss";
import { parse } from "date-fns";

type Program = {
  title: string;
  ft: string;
};

export const updateList = () => {
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
  return new Promise((resolve, reject) => {
    const list: string[] = [];
    const str = client.listObjectsV2("mystation", "output/");
    str.on("data", (obj) => {
      if (obj.prefix.match(/\d{14}\-([A-Z]|\-)+/)) {
        list.push(obj.prefix);
      }
    });
    str.on("end", async () => {
      const sorted = list.sort().reverse();
      const metas = [];
      for (const prefix of sorted) {
        try {
          const data = (await getObject(
            "mystation",
            `${prefix}meta.json`
          )) as Program;
          const stat = await client.statObject("mystation", `${prefix}a.mp3`);
          metas.push(data);
          feed.item({
            title: data.title,
            enclosure: {
              url: `${process.env.ASSET_DOMAIN}/${prefix}a.mp3`,
              size: stat.size,
            },
            description: "",
            url: `${process.env.ASSET_DOMAIN}/${prefix}a.mp3`,
            date: parse(data.ft, "yyyyMMddHHmmss", new Date()),
          });
        } catch (err) {
          console.error(err);
          continue;
        }
      }
      const res = await client.putObject("mystation", "feed.xml", feed.xml(), {
        "Content-Type": "application/xml",
      });
      console.log(res);
      resolve(void 0);
    });
  });
};
