import { NextRequest, NextResponse } from "next/server";

const ACROSS_BASE = "https://app.across.to/api";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const depositTxHash = sp.get("depositTxHash");
  const originChainId = sp.get("originChainId");

  if (!depositTxHash || !originChainId) {
    return NextResponse.json({ error: "missing params" }, { status: 400 });
  }

  const url = new URL(`${ACROSS_BASE}/deposit/status`);
  url.searchParams.set("depositTxHash", depositTxHash);
  url.searchParams.set("originChainId", originChainId);

  try {
    const res = await fetch(url.toString(), { cache: "no-store" });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "fetch failed" }, { status: 500 });
  }
}
