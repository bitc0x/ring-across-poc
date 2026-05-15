import { NextRequest, NextResponse } from "next/server";

const ACROSS_BASE = "https://app.across.to/api";
const INTEGRATOR_ID = process.env.ACROSS_INTEGRATOR_ID || "0x00f0";
const API_KEY = process.env.ACROSS_API_KEY || "";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  const inputToken = sp.get("inputToken");
  const outputToken = sp.get("outputToken");
  const originChainId = sp.get("originChainId");
  const destinationChainId = sp.get("destinationChainId");
  const amount = sp.get("amount");
  const depositor = sp.get("depositor");
  const tradeType = sp.get("tradeType") || "minOutput";

  if (!inputToken || !outputToken || !originChainId || !destinationChainId || !amount || !depositor) {
    return NextResponse.json({ error: "missing params" }, { status: 400 });
  }

  const recipient = sp.get("recipient") || depositor;

  const url = new URL(`${ACROSS_BASE}/swap/approval`);
  url.searchParams.set("inputToken", inputToken);
  url.searchParams.set("outputToken", outputToken);
  url.searchParams.set("originChainId", originChainId);
  url.searchParams.set("destinationChainId", destinationChainId);
  url.searchParams.set("amount", amount);
  url.searchParams.set("depositor", depositor);
  url.searchParams.set("recipient", recipient);
  url.searchParams.set("tradeType", tradeType);
  url.searchParams.set("integratorId", INTEGRATOR_ID);
  url.searchParams.set("skipOriginTxEstimation", "true");

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;
    const res = await fetch(url.toString(), { headers, cache: "no-store" });
    const text = await res.text();
    if (!res.ok) {
      return new NextResponse(text || "across error", { status: res.status });
    }
    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "fetch failed" }, { status: 500 });
  }
}
