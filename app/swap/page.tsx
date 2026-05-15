"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount, useChainId, useSwitchChain, useWalletClient, usePublicClient } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  CHAINS, TOKENS, SOURCE_CHAINS, DEST_CHAINS,
  tokenForChain, tokenDecimals, tokensOnChain, fetchSwapQuote,
  formatTokenAmount, formatFillTime,
  totalFeePct, needsApproval, buildApprovalCalldata,
  type SwapQuote,
} from "@/lib/across";
import { parseUnits } from "viem";

type Tab = "swap" | "stock" | "crosschain";

export default function SwapPage() {
  const [tab, setTab] = useState<Tab>("crosschain");

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/ring-logo.png" alt="Ring" width={28} height={28} style={{ borderRadius: 6 }} />
            <span className="ring-text" style={{ fontSize: 17 }}>Ring Swap</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#999" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <div style={{ display: "flex", gap: 22, marginLeft: 8 }}>
            <NavLink active>Trade</NavLink>
            <NavLink>Explore</NavLink>
            <NavLink>Pool</NavLink>
            <NavLink>Referrals</NavLink>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" style={{ fontSize: 12, color: "var(--text-3)", textDecoration: "underline" }}>← Back to pitch</Link>
          <button style={{ width: 32, height: 32, borderRadius: 999, background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="2" cy="7" r="1.5"/><circle cx="7" cy="7" r="1.5"/><circle cx="12" cy="7" r="1.5"/></svg>
          </button>
          <div style={{ marginLeft: 4 }}><ConnectButton accountStatus="address" chainStatus="icon" showBalance={false} /></div>
        </div>
      </nav>

      <div style={{ display: "flex", justifyContent: "center", padding: "32px 16px 80px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 4, background: "var(--bg-card)", padding: 4, borderRadius: 999 }}>
              <TabPill active={tab === "swap"} onClick={() => setTab("swap")}>Swap</TabPill>
              <TabPill active={tab === "stock"} onClick={() => setTab("stock")}>Stock</TabPill>
              <TabPill active={tab === "crosschain"} onClick={() => setTab("crosschain")} accent>Cross-chain</TabPill>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button style={{ width: 32, height: 32, borderRadius: 8, background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="7" cy="7" r="2"/><path d="M7 1v1.5M7 11.5V13M13 7h-1.5M2.5 7H1M11.243 2.757l-1.061 1.061M3.818 10.182l-1.06 1.06M11.243 11.243l-1.061-1.061M3.818 3.818L2.757 2.757"/></svg>
              </button>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 999, background: "var(--bg-card)",
                fontSize: 13, color: "var(--text)",
              }}>
                <div style={{ display: "flex" }}>
                  <Dot color="#9d5cff" />
                  <Dot color="#ff5cb3" offset={-6} />
                  <Dot color="#22d3ee" offset={-12} />
                  <Dot color="#6df5b2" offset={-18} />
                </div>
                <span>(4)</span>
              </div>
            </div>
          </div>

          {tab === "swap" && <SameChainCard label="Same-chain swap (Ring native)" />}
          {tab === "stock" && <SameChainCard label="Stock swap" />}
          {tab === "crosschain" && <CrossChainCard />}
        </div>
      </div>
    </main>
  );
}

function NavLink({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a href="#" style={{
      fontSize: 14, fontWeight: 600,
      color: active ? "var(--text)" : "var(--text-3)",
      transition: "color 0.15s",
    }}>{children}</a>
  );
}

function TabPill({ children, active, onClick, accent }: { children: React.ReactNode; active: boolean; onClick: () => void; accent?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 16px",
      borderRadius: 999,
      fontSize: 14,
      fontWeight: 600,
      background: active ? (accent ? "rgba(109,245,178,0.12)" : "var(--bg-elev)") : "transparent",
      color: active ? (accent ? "var(--across-green)" : "var(--text)") : "var(--text-3)",
      border: active && accent ? "1px solid rgba(109,245,178,0.3)" : "1px solid transparent",
      transition: "all 0.15s",
      display: "flex", alignItems: "center", gap: 6,
    }}>
      {children}
      {accent && (
        <span style={{
          fontSize: 9, fontWeight: 700, padding: "2px 6px",
          background: active ? "rgba(109,245,178,0.18)" : "var(--bg-elev)",
          color: active ? "var(--across-green)" : "var(--text-3)",
          borderRadius: 4, letterSpacing: "0.5px",
        }}>LIVE</span>
      )}
    </button>
  );
}

function Dot({ color, offset = 0 }: { color: string; offset?: number }) {
  return <span style={{ width: 14, height: 14, borderRadius: "50%", background: color, marginLeft: offset, border: "1.5px solid var(--bg-card)" }} />;
}

function SameChainCard({ label }: { label: string }) {
  return (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 12 }}>
      <SimpleTokenBox label="Sell" symbol="ETH" />
      <div style={{ display: "flex", justifyContent: "center", margin: "-8px 0" }}>
        <button style={{ width: 32, height: 32, background: "var(--bg-elev)", border: "3px solid var(--bg-card)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-2)", zIndex: 1 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2v10M3 8l4 4 4-4"/></svg>
        </button>
      </div>
      <SimpleTokenBox label="Buy" symbol="" placeholder="Select token" />
      <button className="btn-primary" style={{ width: "100%", marginTop: 12, padding: 16, fontSize: 16, background: "rgba(79,79,247,0.18)", color: "#a5a5ff", fontWeight: 600 }}>
        Connect wallet
      </button>
      <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "var(--text-3)" }}>{label} · Same-chain swap UI preserved as-is</div>
    </div>
  );
}

function SimpleTokenBox({ label, symbol, placeholder }: { label: string; symbol: string; placeholder?: string }) {
  return (
    <div style={{ background: "var(--bg-elev)", borderRadius: "var(--radius)", padding: 16 }}>
      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 40, color: "var(--text-3)", fontWeight: 400 }}>0</div>
        {symbol ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px 6px 6px", background: "var(--bg-card)", borderRadius: 999 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={TOKENS[symbol]?.logo} alt={symbol} width={24} height={24} style={{ borderRadius: "50%" }} />
            <span style={{ fontWeight: 700 }}>{symbol}</span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#999" strokeWidth="1.4"/></svg>
          </div>
        ) : (
          <button style={{ padding: "8px 14px", background: "var(--primary)", borderRadius: 999, color: "#fff", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
            {placeholder}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#fff" strokeWidth="1.6"/></svg>
          </button>
        )}
      </div>
      <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>$0</div>
    </div>
  );
}

/* ====================== CROSS-CHAIN (Across) ====================== */

function CrossChainCard() {
  const { address, isConnected } = useAccount();
  const walletChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const [sellChain, setSellChain] = useState(42161);
  const [buyChain, setBuyChain] = useState(999);
  const [sellSymbol, setSellSymbol] = useState("USDC");
  const [buySymbol, setBuySymbol] = useState("USDC");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [phase, setPhase] = useState<"idle" | "approving" | "depositing" | "filling" | "complete" | "error">("idle");
  const [txMessage, setTxMessage] = useState<string>("");
  const [originTx, setOriginTx] = useState<string | null>(null);
  const [destTx, setDestTx] = useState<string | null>(null);

  const sellTokenAddr = useMemo(() => tokenForChain(sellSymbol, sellChain), [sellSymbol, sellChain]);
  const buyTokenAddr = useMemo(() => tokenForChain(buySymbol, buyChain), [buySymbol, buyChain]);
  const sellToken = TOKENS[sellSymbol];
  const buyToken = TOKENS[buySymbol];

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    setQuote(null);
    setQuoteError(null);
    if (!amount || !isConnected || !address || !sellTokenAddr || !buyTokenAddr) return;
    if (sellChain === buyChain && sellSymbol === buySymbol) return;

    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setQuoting(true);
      try {
        const wei = parseUnits(amount, tokenDecimals(sellSymbol, sellChain)).toString();
        const q = await fetchSwapQuote({
          inputToken: sellTokenAddr,
          outputToken: buyTokenAddr,
          originChainId: sellChain,
          destinationChainId: buyChain,
          amount: wei,
          depositor: address,
          recipient: address,
          tradeType: "exactInput",
        });
        setQuote(q);
      } catch (e: any) {
        try {
          const parsed = JSON.parse(e.message);
          setQuoteError(parsed.message || parsed.error || "Quote failed");
        } catch {
          setQuoteError(e.message || "Quote failed");
        }
      } finally {
        setQuoting(false);
      }
    }, 350);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [amount, address, isConnected, sellTokenAddr, buyTokenAddr, sellChain, buyChain, sellSymbol, buySymbol]);

  async function ensureChain(targetId: number): Promise<boolean> {
    if (walletChainId === targetId) return true;
    try {
      await switchChain({ chainId: targetId });
      await new Promise((r) => setTimeout(r, 800));
      return true;
    } catch {
      return false;
    }
  }

  async function pollStatus(depositTxHash: string, originChainId: number) {
    const start = Date.now();
    const max = 5 * 60 * 1000;
    while (Date.now() - start < max) {
      try {
        const res = await fetch(`/api/swap-status?depositTxHash=${depositTxHash}&originChainId=${originChainId}`);
        const j = await res.json();
        if (j.status === "filled" && j.fillTx) {
          setDestTx(j.fillTx);
          setPhase("complete");
          setTxMessage("Filled");
          return;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 1500));
    }
    setPhase("error");
    setTxMessage("Timed out waiting for fill. Tx is still valid on Across.");
  }

  async function execute() {
    if (!quote || !walletClient || !publicClient || !address) return;
    setPhase("idle");
    setTxMessage("");
    setOriginTx(null);
    setDestTx(null);

    try {
      const okChain = await ensureChain(sellChain);
      if (!okChain) {
        setPhase("error");
        setTxMessage("Please switch your wallet to the origin chain.");
        return;
      }

      if (needsApproval(quote)) {
        setPhase("approving");
        setTxMessage("Approving token spend...");
        const calldata = buildApprovalCalldata(
          quote.checks.allowance.spender,
          quote.checks.allowance.expected,
        );
        const hash = await walletClient.sendTransaction({
          to: quote.checks.allowance.token as `0x${string}`,
          data: calldata,
          chainId: sellChain,
        });
        await publicClient.waitForTransactionReceipt({ hash });
      }

      if (!quote.swapTx) throw new Error("No swap tx in quote");
      setPhase("depositing");
      setTxMessage("Confirm in wallet...");
      const txHash = await walletClient.sendTransaction({
        to: quote.swapTx.to as `0x${string}`,
        data: quote.swapTx.data as `0x${string}`,
        value: quote.swapTx.value ? BigInt(quote.swapTx.value) : BigInt(0),
        chainId: sellChain,
      });
      setOriginTx(txHash);
      setTxMessage(`Submitted. Waiting for confirmation on ${CHAINS[sellChain].name}...`);
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      setPhase("filling");
      setTxMessage("Routing across the relayer network...");
      await pollStatus(txHash, sellChain);
    } catch (e: any) {
      setPhase("error");
      setTxMessage(e?.shortMessage || e?.message || "Transaction failed");
    }
  }

  function flip() {
    if (!SOURCE_CHAINS.includes(buyChain) || !DEST_CHAINS.includes(sellChain)) return;
    setSellChain(buyChain);
    setBuyChain(sellChain);
    setSellSymbol(buySymbol);
    setBuySymbol(sellSymbol);
  }

  const outputAmount = quote
    ? formatTokenAmount(quote.expectedOutputAmount, quote.outputToken.decimals, 4)
    : "0";

  const buttonState = (() => {
    if (!isConnected) return { label: "Connect wallet", disabled: true, action: () => {} };
    if (sellChain === buyChain && sellSymbol === buySymbol) return { label: "Select different route", disabled: true, action: () => {} };
    if (!amount || parseFloat(amount) <= 0) return { label: "Enter an amount", disabled: true, action: () => {} };
    if (quoting) return { label: "Fetching quote...", disabled: true, action: () => {} };
    if (quoteError) return { label: "Quote unavailable", disabled: true, action: () => {} };
    if (!quote) return { label: "Get quote", disabled: true, action: () => {} };
    if (phase === "approving") return { label: "Approving...", disabled: true, action: () => {} };
    if (phase === "depositing") return { label: "Depositing...", disabled: true, action: () => {} };
    if (phase === "filling") return { label: "Routing across relayers...", disabled: true, action: () => {} };
    if (phase === "complete") return { label: "Swap complete · New swap", disabled: false, action: () => { setPhase("idle"); setAmount(""); setQuote(null); } };
    const destChainName = CHAINS[buyChain].name;
    const ctaLabel = sellSymbol === buySymbol
      ? `Bridge ${sellSymbol} to ${destChainName}`
      : `Swap to ${buySymbol} on ${destChainName}`;
    return { label: ctaLabel, disabled: false, action: execute };
  })();

  return (
    <>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 12, position: "relative" }}>
      <TokenBox
        label="Sell"
        chainId={sellChain}
        symbol={sellSymbol}
        amount={amount}
        onAmountChange={setAmount}
        onChainChange={setSellChain}
        onSymbolChange={setSellSymbol}
        chainOptions={SOURCE_CHAINS}
        editable
      />

      <div style={{ display: "flex", justifyContent: "center", margin: "-8px 0", position: "relative", zIndex: 2 }}>
        <button onClick={flip} style={{
          width: 36, height: 36, background: "var(--bg-elev)",
          border: "3px solid var(--bg-card)", borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-2)",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2v10M3 8l4 4 4-4"/></svg>
        </button>
      </div>

      <TokenBox
        label="Buy"
        chainId={buyChain}
        symbol={buySymbol}
        amount={outputAmount}
        onChainChange={setBuyChain}
        onSymbolChange={setBuySymbol}
        chainOptions={DEST_CHAINS}
        readonly
        muted={!quote}
      />

      {(quoting || quote || quoteError) && (
        <div className="fade-in" style={{
          marginTop: 10, padding: 14,
          background: "var(--bg-elev)", borderRadius: "var(--radius)",
          fontSize: 13,
        }}>
          {quoting && (
            <div style={{ color: "var(--text-2)", display: "flex", alignItems: "center", gap: 8 }}>
              <Spinner />
              Fetching live quote from Across...
            </div>
          )}
          {quoteError && (
            <div style={{ color: "var(--warn)" }}>{quoteError}</div>
          )}
          {quote && !quoting && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              <DetailRow label="Fill time" value={formatFillTime(quote.expectedFillTime)} highlight />
              <DetailRow label="Min received" value={`${formatTokenAmount(quote.minOutputAmount, quote.outputToken.decimals, 4)} ${buySymbol}`} />
              <DetailRow label="Total fee" value={`${totalFeePct(quote).toFixed(4)}%`} />
              <DetailRow label="Route" value={`${CHAINS[sellChain].name} → ${CHAINS[buyChain].name}`} />
            </div>
          )}
        </div>
      )}

      <button
        onClick={buttonState.action}
        disabled={buttonState.disabled}
        style={{
          width: "100%", marginTop: 12, padding: 16, fontSize: 16, fontWeight: 600,
          borderRadius: "var(--radius)",
          background: buttonState.disabled
            ? "rgba(109,245,178,0.08)"
            : "linear-gradient(135deg, #2dc878, #6df5b2)",
          color: buttonState.disabled ? "var(--text-3)" : "#0a2418",
          cursor: buttonState.disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}>
        {buttonState.label}
      </button>

      {phase !== "idle" && (
        <div className="fade-in" style={{
          marginTop: 10, padding: 12,
          background: phase === "complete" ? "rgba(34,197,94,0.08)" :
                       phase === "error" ? "rgba(239,68,68,0.08)" :
                       "var(--bg-elev)",
          border: `1px solid ${phase === "complete" ? "rgba(34,197,94,0.2)" :
                                phase === "error" ? "rgba(239,68,68,0.2)" :
                                "var(--border)"}`,
          borderRadius: "var(--radius)",
          fontSize: 13,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: originTx || destTx ? 6 : 0 }}>
            {phase === "complete" ? <Checkmark /> : phase === "error" ? <ErrorIcon /> : <Spinner />}
            <span style={{ color: phase === "complete" ? "var(--success)" : phase === "error" ? "var(--error)" : "var(--text-2)" }}>
              {txMessage}
            </span>
          </div>
          {originTx && (
            <a href={`${CHAINS[sellChain].explorer}/tx/${originTx}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--text-3)", textDecoration: "underline" }}>
              Origin tx: {originTx.slice(0, 10)}...{originTx.slice(-8)}
            </a>
          )}
          {destTx && (
            <div style={{ marginTop: 4 }}>
              <a href={`https://app.across.to/transactions`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "var(--across-green)", textDecoration: "underline" }}>
                View on Across Scan →
              </a>
            </div>
          )}
        </div>
      )}
    </div>

    <div style={{
      display: "flex", justifyContent: "center", marginTop: 14,
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "7px 14px",
        background: "var(--bg-card)",
        border: "1px solid rgba(109,245,178,0.25)",
        borderRadius: 999,
        fontSize: 11, fontWeight: 600, letterSpacing: "0.7px",
        color: "var(--across-green)",
      }}>
        <Image src="/across-logo.png" alt="Across" width={14} height={14} style={{ borderRadius: "50%" }} />
        POWERED BY ACROSS
      </div>
    </div>
    </>
  );
}

function TokenBox({
  label, chainId, symbol, amount, onAmountChange, onChainChange, onSymbolChange, chainOptions, editable, readonly, muted,
}: {
  label: string;
  chainId: number;
  symbol: string;
  amount: string;
  onAmountChange?: (v: string) => void;
  onChainChange: (id: number) => void;
  onSymbolChange: (s: string) => void;
  chainOptions: number[];
  editable?: boolean;
  readonly?: boolean;
  muted?: boolean;
}) {
  const [chainOpen, setChainOpen] = useState(false);
  const [tokenOpen, setTokenOpen] = useState(false);
  const chain = CHAINS[chainId];
  const availableTokens = tokensOnChain(chainId);

  useEffect(() => {
    if (!availableTokens.includes(symbol) && availableTokens.length > 0) {
      onSymbolChange(availableTokens[0]);
    }
  }, [chainId, symbol, availableTokens, onSymbolChange]);

  return (
    <div style={{ background: "var(--bg-elev)", borderRadius: "var(--radius)", padding: 16, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: "var(--text-3)" }}>{label}</span>
        <ChainPicker chain={chain} open={chainOpen} setOpen={setChainOpen} options={chainOptions} onSelect={onChainChange} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        {editable ? (
          <input
            value={amount}
            onChange={(e) => onAmountChange && onAmountChange(e.target.value.replace(/[^0-9.]/g, ""))}
            placeholder="0"
            inputMode="decimal"
            style={{
              flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none",
              fontSize: 36, fontWeight: 500, color: "var(--text)", padding: 0,
              fontVariantNumeric: "tabular-nums",
            }}
          />
        ) : (
          <div style={{
            flex: 1, fontSize: 36, fontWeight: 500,
            color: muted ? "var(--text-3)" : "var(--text)",
            fontVariantNumeric: "tabular-nums",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {amount || "0"}
          </div>
        )}
        <TokenPicker symbol={symbol} open={tokenOpen} setOpen={setTokenOpen} options={availableTokens} onSelect={onSymbolChange} />
      </div>
    </div>
  );
}

function ChainPicker({ chain, open, setOpen, options, onSelect }: {
  chain: any; open: boolean; setOpen: (b: boolean) => void; options: number[]; onSelect: (id: number) => void;
}) {
  if (!chain) return null;
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "4px 10px 4px 4px", background: "var(--bg-card)",
        borderRadius: 999, fontSize: 12, color: "var(--text-2)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={chain.logo} alt={chain.name} width={18} height={18} style={{ borderRadius: "50%" }} />
        {chain.name}
        <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ marginRight: 4 }}><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4"/></svg>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: 6,
            minWidth: 180, zIndex: 30, boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
            maxHeight: 320, overflowY: "auto",
          }}>
            {options.map((id) => {
              const c = CHAINS[id];
              if (!c) return null;
              return (
                <button key={id} onClick={() => { onSelect(id); setOpen(false); }} style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, color: "var(--text)",
                  background: id === chain.id ? "var(--bg-elev)" : "transparent",
                  textAlign: "left",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logo} alt={c.name} width={20} height={20} style={{ borderRadius: "50%" }} />
                  {c.name}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TokenPicker({ symbol, open, setOpen, options, onSelect }: {
  symbol: string; open: boolean; setOpen: (b: boolean) => void; options: string[]; onSelect: (s: string) => void;
}) {
  const token = TOKENS[symbol];
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px 6px 6px", background: "var(--bg-card)",
        borderRadius: 999, fontSize: 14, fontWeight: 700,
      }}>
        {token && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={token.logo} alt={symbol} width={22} height={22} style={{ borderRadius: "50%" }} />
        )}
        {symbol}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="#999" strokeWidth="1.4"/></svg>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", padding: 6,
            minWidth: 150, zIndex: 30, boxShadow: "0 12px 36px rgba(0,0,0,0.5)",
          }}>
            {options.map((s) => {
              const t = TOKENS[s];
              return (
                <button key={s} onClick={() => { onSelect(s); setOpen(false); }} style={{
                  width: "100%", padding: "8px 10px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 14, fontWeight: 600, color: "var(--text)",
                  background: s === symbol ? "var(--bg-elev)" : "transparent",
                  textAlign: "left",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.logo} alt={s} width={22} height={22} style={{ borderRadius: "50%" }} />
                  {s}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ color: "var(--text-3)", fontSize: 12 }}>{label}</span>
      <span style={{ color: highlight ? "var(--across-green)" : "var(--text)", fontWeight: highlight ? 700 : 500, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14,
      border: "2px solid var(--border)",
      borderTopColor: "var(--across-green)",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }} />
  );
}

function Checkmark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="7" fill="var(--success)" />
      <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="7" fill="var(--error)" />
      <path d="M5 5l4 4M9 5l-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
