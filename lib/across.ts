export type AcrossChain = {
  id: number;
  name: string;
  shortName: string;
  color: string;
  explorer: string;
  logo: string;
};

const LOGO_BASE = "https://alexandria-blond.vercel.app/assets/chains";

export const CHAINS: Record<number, AcrossChain> = {
  1:     { id: 1,     name: "Ethereum",    shortName: "ETH",   color: "#627eea", explorer: "https://etherscan.io",            logo: `${LOGO_BASE}/mainnet.svg` },
  10:    { id: 10,    name: "Optimism",    shortName: "OP",    color: "#ff0420", explorer: "https://optimistic.etherscan.io", logo: `${LOGO_BASE}/optimism.svg` },
  42161: { id: 42161, name: "Arbitrum",    shortName: "ARB",   color: "#28a0f0", explorer: "https://arbiscan.io",             logo: `${LOGO_BASE}/arbitrum.svg` },
  8453:  { id: 8453,  name: "Base",        shortName: "BASE",  color: "#0052ff", explorer: "https://basescan.org",            logo: `${LOGO_BASE}/base.svg` },
  81457: { id: 81457, name: "Blast",       shortName: "BLAST", color: "#fcfc03", explorer: "https://blastscan.io",            logo: `${LOGO_BASE}/blast.svg` },
  999:   { id: 999,   name: "HyperEVM",    shortName: "HYPE",  color: "#97fce4", explorer: "https://hyperevmscan.io",         logo: `${LOGO_BASE}/hyperevm.svg` },
  1337:  { id: 1337,  name: "HyperCore",   shortName: "CORE",  color: "#97fce4", explorer: "https://app.hyperliquid.xyz/explorer", logo: `${LOGO_BASE}/hypercore.svg` },
};

export type AcrossToken = {
  symbol: string;
  name: string;
  decimals: number;
  decimalsByChain?: Partial<Record<number, number>>;
  addresses: Partial<Record<number, string>>;
  logo: string;
};

const ZERO = "0x0000000000000000000000000000000000000000";
const TW = (addr: string) =>
  `https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/${addr}/logo.png?raw=true`;

export const TOKENS: Record<string, AcrossToken> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    addresses: { 1: ZERO, 10: ZERO, 42161: ZERO, 8453: ZERO, 81457: ZERO },
    logo: TW("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    decimalsByChain: { 1337: 8 },
    addresses: {
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      999: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
      1337: "0x2000000000000000000000000000000000000000",
    },
    logo: TW("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    decimalsByChain: { 1337: 8 },
    addresses: {
      1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      10: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      42161: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
      1337: "0x200000000000000000000000000000000000010C",
    },
    logo: TW("0xdAC17F958D2ee523a2206206994597C13D831ec7"),
  },
};

// Source = where users sign deposit txs. Destination = where they receive. Must match wagmi chains.
export const SOURCE_CHAINS = [1, 10, 42161, 8453, 81457];
export const DEST_CHAINS = [1, 42161, 8453, 81457, 999, 1337];

export function tokenForChain(symbol: string, chainId: number): string | undefined {
  return TOKENS[symbol]?.addresses[chainId];
}

export function tokenDecimals(symbol: string, chainId: number): number {
  const t = TOKENS[symbol];
  if (!t) return 18;
  return t.decimalsByChain?.[chainId] ?? t.decimals;
}

export function tokensOnChain(chainId: number): string[] {
  return Object.keys(TOKENS).filter((s) => TOKENS[s].addresses[chainId]);
}

export type FeeAmount = {
  amount: string;
  amountUsd?: string;
  pct: string;
  token: { decimals: number; symbol: string; address: string; chainId: number };
};

export type SwapQuote = {
  crossSwapType: string;
  amountType: string;
  checks: {
    allowance: { token: string; spender: string; actual: string; expected: string };
    balance: { token: string; actual: string; expected: string };
  };
  steps: {
    bridge?: {
      inputAmount: string;
      outputAmount: string;
      tokenIn: { symbol: string; decimals: number; address: string; chainId: number };
      tokenOut: { symbol: string; decimals: number; address: string; chainId: number };
      fees?: any;
    };
    originSwap?: any;
    destinationSwap?: any;
  };
  inputToken: { symbol: string; decimals: number; address: string; chainId: number };
  outputToken: { symbol: string; decimals: number; address: string; chainId: number };
  inputAmount: string;
  maxInputAmount: string;
  expectedOutputAmount: string;
  minOutputAmount: string;
  expectedFillTime: number;
  fees: { total: FeeAmount; totalMax?: FeeAmount; originGas?: FeeAmount };
  swapTx: {
    ecosystem: string;
    simulationSuccess?: boolean;
    chainId: number;
    to: string;
    data: string;
    value?: string;
    gas?: string;
  };
  quoteExpiryTimestamp: number;
  id: string;
};

export async function fetchSwapQuote(params: {
  inputToken: string;
  outputToken: string;
  originChainId: number;
  destinationChainId: number;
  amount: string;
  depositor: string;
  recipient?: string;
  tradeType?: "exactInput" | "exactOutput" | "minOutput";
}): Promise<SwapQuote> {
  const url = new URL("/api/swap-approval", window.location.origin);
  url.searchParams.set("inputToken", params.inputToken);
  url.searchParams.set("outputToken", params.outputToken);
  url.searchParams.set("originChainId", params.originChainId.toString());
  url.searchParams.set("destinationChainId", params.destinationChainId.toString());
  url.searchParams.set("amount", params.amount);
  url.searchParams.set("depositor", params.depositor);
  if (params.recipient) url.searchParams.set("recipient", params.recipient);
  url.searchParams.set("tradeType", params.tradeType || "exactInput");

  const res = await fetch(url.toString());
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Quote failed");
  }
  return res.json();
}

export function formatTokenAmount(raw: string | bigint, decimals: number, maxFrac = 6): string {
  const big = typeof raw === "string" ? BigInt(raw) : raw;
  const divisor = BigInt(10) ** BigInt(decimals);
  const whole = big / divisor;
  const fraction = big % divisor;
  if (fraction === BigInt(0)) return whole.toString();
  let fracStr = fraction.toString().padStart(decimals, "0");
  fracStr = fracStr.slice(0, maxFrac).replace(/0+$/, "");
  if (!fracStr) return whole.toString();
  return `${whole.toString()}.${fracStr}`;
}

export function formatFillTime(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`;
  const mins = Math.floor(seconds / 60);
  return `~${mins}m ${seconds % 60}s`;
}

export function totalFeePct(quote: SwapQuote): number {
  const total = quote.fees?.total;
  if (total?.pct) {
    return (parseFloat(total.pct) / 1e18) * 100;
  }
  return 0;
}

export function needsApproval(quote: SwapQuote): boolean {
  if (!quote.checks?.allowance) return false;
  try {
    return BigInt(quote.checks.allowance.actual) < BigInt(quote.checks.allowance.expected);
  } catch {
    return false;
  }
}

export function buildApprovalCalldata(spender: string, amount: string): `0x${string}` {
  const selector = "095ea7b3";
  const spenderPadded = spender.toLowerCase().replace("0x", "").padStart(64, "0");
  const amountHex = BigInt(amount).toString(16).padStart(64, "0");
  return `0x${selector}${spenderPadded}${amountHex}` as `0x${string}`;
}

// Coverage display: Ring's 4 active chains first, then other Across-supported chains.
export const COVERAGE_CHAINS = [
  { id: 1,     name: "Ethereum",    logo: `${LOGO_BASE}/mainnet.svg`,     onRing: true  },
  { id: 999,   name: "Hyperliquid", logo: `${LOGO_BASE}/hyperevm.svg`,    onRing: true  },
  { id: 56,    name: "BNB Chain",   logo: `${LOGO_BASE}/bsc.svg`,         onRing: true  },
  { id: 81457, name: "Blast",       logo: `${LOGO_BASE}/blast.svg`,       onRing: true  },
  { id: 42161, name: "Arbitrum",    logo: `${LOGO_BASE}/arbitrum.svg`,    onRing: false },
  { id: 8453,  name: "Base",        logo: `${LOGO_BASE}/base.svg`,        onRing: false },
  { id: 10,    name: "Optimism",    logo: `${LOGO_BASE}/optimism.svg`,    onRing: false },
  { id: -1,    name: "Solana",      logo: `${LOGO_BASE}/solana.svg`,      onRing: false },
  { id: 137,   name: "Polygon",     logo: `${LOGO_BASE}/polygon.svg`,     onRing: false },
  { id: 130,   name: "Unichain",    logo: `${LOGO_BASE}/unichain.svg`,    onRing: false },
  { id: 59144, name: "Linea",       logo: `${LOGO_BASE}/linea.svg`,       onRing: false },
  { id: 34443, name: "Mode",        logo: `${LOGO_BASE}/mode.svg`,        onRing: false },
  { id: 1868,  name: "Soneium",     logo: `${LOGO_BASE}/soneium.svg`,     onRing: false },
  { id: 480,   name: "World",       logo: `${LOGO_BASE}/world-chain.svg`, onRing: false },
  { id: 57073, name: "Ink",         logo: `${LOGO_BASE}/ink.svg`,         onRing: false },
  { id: 9745,  name: "Plasma",      logo: `${LOGO_BASE}/plasma.svg`,      onRing: false },
];
