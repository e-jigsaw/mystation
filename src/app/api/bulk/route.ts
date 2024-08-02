import { NextResponse } from "next/server";
import { xml2json, unwrapText } from "lib/xml2json";
import { db } from "db/db";
import { eq } from "drizzle-orm";
import { radio, programs } from "db/schema";

export async function GET() {
  // const res = await fetch(`${process.env.DOMAIN}/api/feed`);
  // const text = await res.text();
  // for (const program of (xml2json(text) as any).rss.channel.item) {
  //   const title = unwrapText(program.title);
  //   let r = await db.query.radio.findFirst({ where: eq(radio.name, title) });
  //   if (!r) {
  //     const res = await db.insert(radio).values({ name: title }).returning();
  //     if (res.length > 0) {
  //       r = res[0];
  //     }
  //   }
  //   const pubDate = new Date(unwrapText(program.pubDate));
  //   const p = await db.insert(programs).values({
  //     body: {
  //       url: program.enclosure.url,
  //       size: Number(program.enclosure.length),
  //     },
  //     radioId: r?.id,
  //     pubDate,
  //   });
  //   console.log(p);
  // }
  return NextResponse.json({ ok: true });
}
