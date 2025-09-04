import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 500 });
  }
}
