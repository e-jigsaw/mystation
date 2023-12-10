import { NextResponse } from "next/server";
import { getPrograms } from "lib/getPrograms";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const d = url.searchParams.get("d");
  if (d) {
    return NextResponse.json({
      ok: true,
      data: await getPrograms(d),
    });
  }
  return NextResponse.json({ ok: false });
}
