import { NextResponse } from "next/server";
import { exec, execSync } from "child_process";
import { client } from "lib/getClient";
import { postMessage } from "lib/postMessage";
import { db } from "db/db";
import { programs, radio } from "db/schema";
import { eq } from "drizzle-orm";
import { parse } from "date-fns";

export async function POST(req: Request) {
  const body = await req.json();
  postMessage(`rcv: ${body.title}`);
  if (body.ft.match(/\d{14}/) && body.id.match(/([A-Z]|\-)+/)) {
    exec(
      `docker run -v ./output:/output radigo rec -o=mp3 -id=${body.id} -s=${body.ft}`,
      async (error) => {
        if (error) {
          postMessage(`error: ${error.message}`);
          return;
        }
        postMessage(`donwloaded: ${body.title}`);
        const filename = `${body.ft}-${body.id}`;
        const [meta, file] = await Promise.all([
          client.putObject(
            process.env.MINIO_BUCKET!,
            `output/${filename}/meta.json`,
            JSON.stringify(body)
          ),
          client.fPutObject(
            process.env.MINIO_BUCKET!,
            `output/${filename}/a.mp3`,
            `./output/${filename}.mp3`
          ),
        ]);
        const stat = await client.statObject(
          process.env.MINIO_BUCKET!,
          `output/${filename}/a.mp3`
        );
        postMessage(`uploaded: meta:${meta.etag}/file:${file.etag}`);
        execSync(`rm -rf ./output/${filename}.mp3`);
        let r = await db.query.radio.findFirst({
          where: eq(radio.name, body.title),
        });
        if (!r) {
          const res = await db
            .insert(radio)
            .values({ name: body.title })
            .returning();
          if (res.length > 0) {
            r = res[0];
          }
        }
        const p = await db
          .insert(programs)
          .values({
            body: {
              url: `${process.env.ASSET_DOMAIN}/output/${filename}/a.mp3`,
              size: stat.size,
            },
            radioId: r?.id,
            pubDate: parse(body.ft, "yyyyMMddHHmmss", new Date()),
          })
          .returning();
        postMessage(`DB Updated: ${p[0].id}`);
      }
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  } else {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
