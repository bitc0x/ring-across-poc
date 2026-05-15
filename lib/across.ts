export type AcrossChain = {
  id: number;
  name: string;
  shortName: string;
  color: string;
  explorer: string;
};

export const CHAINS: Record<number, AcrossChain> = {
  1: { id: 1, name: "Ethereum", shortName: "ETH", color: "#627eea", explorer: "https://etherscan.io" },
  10: { id: 10, name: "Optimism", shortName: "OP", color: "#ff0420", explorer: "https://optimistic.etherscan.io" },
  42161: { id: 42161, name: "Arbitrum", shortName: "ARB", color: "#28a0f0", explorer: "https://arbiscan.io" },
  8453: { id: 8453, name: "Base", shortName: "BASE", color: "#0052ff", explorer: "https://basescan.org" },
  130: { id: 130, name: "Unichain", shortName: "UNI", color: "#f50db4", explorer: "https://uniscan.xyz" },
  999: { id: 999, name: "HyperEVM", shortName: "HYPE", color: "#97fce4", explorer: "https://hyperevmscan.io" },
};

export type AcrossToken = {
  symbol: string;
  name: string;
  decimals: number;
  addresses: Partial<Record<number, string>>;
};

const ZERO = "0x0000000000000000000000000000000000000000";

export const TOKENS: Record<string, AcrossToken> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    addresses: { 1: ZERO, 10: ZERO, 42161: ZERO, 8453: ZERO, 130: ZERO },
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    addresses: {
      1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      10: "0x4200000000000000000000000000000000000006",
      42161: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      8453: "0x4200000000000000000000000000000000000006",
      130: "0x4200000000000000000000000000000000000006",
    },
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    addresses: {
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      10: "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
      42161: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      130: "0x078D782b760474a361dDA0AF3839290b0EF57AD6",
    },
  },
  USDT: {
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    addresses: {
      1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      10: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
      42161: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped BTC",
    decimals: 8,
    addresses: {
      1: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      10: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
      42161: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
      8453: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    },
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    addresses: {
      1: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      10: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
      42161: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
  },
};

export const SOURCE_CHAINS = [1, 10, 42161, 8453, 130];
export const DEST_CHAINS = [1, 42161, 8453, 130, 999];

export function tokenForChain(symbol: string, chainId: number): string | undefined {
  return TOKENS[symbol]?.addresses[chainId];
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
  url.searchParams.set("tradeType", params.tradeType || "minOutput");

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

export function bridgeFeePct(quote: SwapQuote): number {
  const bridgeFees = quote.steps.bridge?.fees;
  if (bridgeFees?.pct) {
    return (parseFloat(bridgeFees.pct) / 1e18) * 100;
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
