import { NextResponse } from "next/server";
import { postMessage } from "lib/postMessage";

export async function GET() {
  const res = await postMessage("ping");
  if (res.ok) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: false });
  }
}
