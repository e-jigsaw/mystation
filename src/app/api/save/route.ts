import { NextResponse } from "next/server";
import { exec } from "child_process";
import { client } from "lib/getClient";
import { updateList } from "lib/updateList";

export async function POST(req: Request) {
  const body = await req.json();
  if (body.ft.match(/\d{14}/) && body.id.match(/([A-Z]|\-)+/)) {
    exec(
      `docker run -v ./output:/output radigo rec -o=mp3 -id=${body.id} -s=${body.ft}`,
      async () => {
        const filename = `${body.ft}-${body.id}`;
        const [meta, file] = await Promise.all([
          client.putObject(
            "mystation",
            `output/${filename}/meta.json`,
            JSON.stringify(body)
          ),
          client.fPutObject(
            "mystation",
            `output/${filename}/a.mp3`,
            `./output/${filename}.mp3`
          ),
        ]);
        console.log(meta, file);
        await updateList();
        console.log("updated RSS");
      }
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  } else {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
