import { NextResponse } from "next/server";
import { exec, execSync } from "child_process";
import { client } from "lib/getClient";
import { updateList } from "lib/updateList";
import { postMessage } from "lib/postMessage";

export async function POST(req: Request) {
  const body = await req.json();
  postMessage(`rcv: ${body.title}`);
  if (body.ft.match(/\d{14}/) && body.id.match(/([A-Z]|\-)+/)) {
    exec(
      `docker run -v ./output:/output radigo rec -o=mp3 -id=${body.id} -s=${body.ft}`,
      async () => {
        postMessage(`donwloaded: ${body.title}`);
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
        postMessage(`uploaded: meta:${meta.etag}/file:${file.etag}`);
        execSync(`rm -rf ./output/${filename}.mp3`);
        await updateList();
        postMessage(`RSS Updated!`);
      }
    );
    return NextResponse.json({ ok: true }, { status: 200 });
  } else {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
