import { NextResponse } from "next/server";
import { db } from "db/db";
import { desc, eq } from "drizzle-orm";
import { programs, radio } from "db/schema";
import RSS from "rss";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const r = await db.query.radio.findFirst({
    where: eq(radio.id, Number(params.id)),
  });
  if (r) {
    const res = await db.query.programs.findMany({
      where: eq(programs.radioId, Number(params.id)),
      orderBy: [desc(programs.pubDate)],
    });
    const feed = new RSS({
      title: r.name,
      description: "",
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
    for (const p of res) {
      feed.item({
        title: r.name,
        enclosure: p.body,
        description: "",
        url: p.body.url,
        date: p.pubDate,
      });
    }
    const re = new Response(feed.xml(), {
      status: 200,
    });
    re.headers.append("content-type", "text/xml");
    return re;
  }
  return NextResponse.json({ ok: false });
}
