import { updateList } from "lib/updateList";
import { NextResponse } from "next/server";

export async function GET() {
  // TODO
}

export async function PUT() {
  await updateList();
  return NextResponse.json({ ok: true });
}
