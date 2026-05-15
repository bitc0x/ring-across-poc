"use client";

import Link from "next/link";

const PARTNERS = [
  { name: "Circle", color: "#5fbfff" },
  { name: "Coinbase", color: "#0052ff" },
  { name: "Uniswap", color: "#ff007a" },
  { name: "MetaMask", color: "#f6851b" },
  { name: "PancakeSwap", color: "#d1884f" },
  { name: "Hyperbeat", color: "#97fce4" },
  { name: "Hybra", color: "#8b5cf6" },
  { name: "Outcome.xyz", color: "#22d3ee" },
  { name: "Stratium", color: "#a78bfa" },
];

export default function Landing() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 32px", borderBottom: "1px solid var(--border-soft)",
        position: "sticky", top: 0, background: "rgba(10,10,13,0.85)", backdropFilter: "blur(12px)", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="ring-logo" />
          <span className="ring-text" style={{ fontSize: 16 }}>Ring</span>
          <span style={{ color: "var(--text-3)", fontWeight: 500, fontSize: 14 }}>×</span>
          <AcrossLogo />
          <span style={{ fontWeight: 600, fontSize: 16 }}>Across</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="https://docs.across.to" target="_blank" rel="noreferrer" className="btn-ghost" style={{ padding: "8px 16px", fontSize: 13 }}>Docs</a>
          <Link href="/swap" className="btn-primary" style={{ padding: "8px 18px", fontSize: 13 }}>Live demo →</Link>
        </div>
      </nav>

      {/* hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 40px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "6px 14px", borderRadius: 999,
          background: "var(--primary-soft)", border: "1px solid rgba(79,79,247,0.25)",
          fontSize: 12, color: "#a5a5ff", marginBottom: 24, fontWeight: 500,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--across-green)", animation: "pulse 2s infinite" }} />
          Integration proposal · Ring Protocol
        </div>
        <h1 style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 20 }}>
          Make every Ring swap{" "}
          <span style={{ background: "linear-gradient(90deg, #ff5cb3, #9d5cff, #6464ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            cross-chain.
          </span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-2)", maxWidth: 720, margin: "0 auto 36px", lineHeight: 1.6 }}>
          Ring is live on 7 chains. Users still can&apos;t move between them inside the Ring UI. Plug in Across, and one Swap card serves every chain, every asset, every user.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <Link href="/swap" className="btn-primary" style={{ fontSize: 15, padding: "14px 28px" }}>
            Try the live PoC →
          </Link>
          <a href="#deal" className="btn-ghost" style={{ fontSize: 15, padding: "14px 28px" }}>What Ring gets</a>
        </div>
      </section>

      {/* stat strip */}
      <section style={{ maxWidth: 1200, margin: "40px auto 0", padding: "0 32px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
          background: "var(--border-soft)", border: "1px solid var(--border-soft)",
          borderRadius: "var(--radius-lg)", overflow: "hidden",
        }}>
          <Stat label="Total volume bridged" value="$35B+" />
          <Stat label="Fill time, median" value="<2s" />
          <Stat label="Independent relayers" value="40+" />
          <Stat label="Live integrations" value="40+ dApps" />
        </div>
      </section>

      {/* THE OPPORTUNITY */}
      <section id="deal" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px" }}>
        <SectionLabel>What Ring unlocks</SectionLabel>
        <h2 style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-1px", marginBottom: 12 }}>
          One Swap card. Every chain. New revenue.
        </h2>
        <p style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 680, marginBottom: 40 }}>
          Drop the Across Swap API into the existing Swap card. No UX redesign, no separate bridge product. Users sell on Ethereum, buy on Hyper, ship on Base, all without leaving Ring.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <Pillar
            num="01"
            title="Retention"
            line="Stop losing users at the bridge."
            body="Today, a user holding USDC on Arbitrum who wants exposure on Hyper has to leave Ring, find a bridge, wait, and rarely comes back. With Across embedded, that flow stays in Ring. Same card, same session, same brand."
            color="#ff5cb3"
          />
          <Pillar
            num="02"
            title="Reach"
            line="Onboard users from any chain, any asset."
            body="Your Hyper deployment is sitting on top of Hyperliquid demand. Across unlocks native deposits from Ethereum, Arbitrum, Base, Optimism, Unichain straight into Ring on Hyper. The ~40% of users who can't currently transact become addressable overnight."
            color="#9d5cff"
          />
          <Pillar
            num="03"
            title="Revenue"
            line="Monetize every cross-chain swap."
            body="appFee on the Swap API lets Ring take a configurable cut of every cross-chain trade, on top of standard Ring fees. New revenue line, zero engineering on the take-rate side."
            color="#6464ff"
          />
        </div>
      </section>

      {/* DEEPER USE CASE */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(109,245,178,0.06) 0%, rgba(79,79,247,0.06) 100%)",
          border: "1px solid rgba(109,245,178,0.18)",
          borderRadius: "var(--radius-lg)",
          padding: 40,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
          alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-block", padding: "4px 10px",
              background: "rgba(109,245,178,0.12)", color: "var(--across-green)",
              borderRadius: 999, fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 16,
            }}>EMBEDDED ACTIONS</div>
            <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12 }}>
              Cross-chain deposits into Ring pools.
            </h3>
            <p style={{ color: "var(--text-2)", fontSize: 15, lineHeight: 1.65, marginBottom: 16 }}>
              Across destination actions let a user on any chain deposit straight into a Ring pool in one transaction. Sell ETH on Mainnet, LP into a Hyper pool. No manual bridge, no second approval, no idle capital.
            </p>
            <p style={{ color: "var(--text-3)", fontSize: 13, lineHeight: 1.5 }}>
              Same primitive that powers Moonwell, Lido EarnETH, Nest, and ICHI vault flows we&apos;ve shipped with other partners.
            </p>
          </div>
          <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", padding: 24, border: "1px solid var(--border)" }}>
            <FlowStep label="Step 1" body="User holds USDC on Arbitrum." />
            <FlowConnector />
            <FlowStep label="Step 2" body="Selects 'Add liquidity' on Ring Hyper pool." />
            <FlowConnector />
            <FlowStep label="Step 3" body="Across routes, fills, and deposits LP atomically." accent />
            <FlowConnector />
            <FlowStep label="Result" body="LP position live on Hyper. One signature." success />
          </div>
        </div>
      </section>

      {/* WHY ACROSS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px" }}>
        <SectionLabel>Why Across</SectionLabel>
        <h2 style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-1px", marginBottom: 32 }}>
          The infrastructure under the cross-chain layer.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <Feature title="Speed" body="Sub-2 second median fill time across all routes." />
          <Feature title="Cost" body="Lowest fees in the category, verifiable on-chain." />
          <Feature title="Decentralization" body="40+ competing independent relayers. Funds escrowed in audited contracts, settled via UMA optimistic oracle. No single point of failure." />
          <Feature title="SLAs" body="Volume commitments, dedicated relayers, integrator-grade support and uptime guarantees for partners shipping in production." />
          <Feature title="Marketing" body="Co-marketing on launch, X amplification, joint blog content, ecosystem placement across the Across partner network." />
          <Feature title="Coverage" body="Ethereum, Arbitrum, Base, Optimism, Polygon, Unichain, Linea, Blast, Mode, Lens, World, ZkSync, Ink, Soneium, Hyper, Plasma." />
          <Feature title="Battle-tested" body="$35B+ bridged. Largest intent-based bridge by sustained volume since 2022." />
          <Feature title="Appfee" body="Configurable take-rate on every swap. Goes straight to a Ring-controlled address." />
        </div>
      </section>

      {/* PARTNERS */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 80px" }}>
        <SectionLabel>Trusted by</SectionLabel>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 24 }}>
          The leaders of crypto already ship Across.
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        }}>
          {PARTNERS.map((p) => (
            <div key={p.name} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "18px 20px",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: 3, background: p.color, flexShrink: 0,
              }} />
              <span style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 100px" }}>
        <div style={{
          background: "linear-gradient(135deg, #1a1a26 0%, #15151b 100%)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: 48,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at top, rgba(79,79,247,0.15), transparent 60%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-1px", marginBottom: 14 }}>
              The PoC is already running.
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 540, margin: "0 auto 28px" }}>
              The cross-chain tab below is the Ring UI with the Across Swap API wired in. Live quotes, live execution, on-chain settlement.
            </p>
            <Link href="/swap" className="btn-primary" style={{ fontSize: 15, padding: "14px 30px" }}>
              Open the live PoC →
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ padding: "24px 32px", borderTop: "1px solid var(--border-soft)", color: "var(--text-3)", fontSize: 12, display: "flex", justifyContent: "space-between" }}>
        <span>Built for Ring Protocol by Across. Risk Labs, 2026.</span>
        <a href="https://across.to" target="_blank" rel="noreferrer">across.to</a>
      </footer>
    </main>
  );
}

function AcrossLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#6df5b2" />
      <path d="M7.5 16L12 7L16.5 16M9 13.5H15" stroke="#0d2b1d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--bg-card)", padding: "28px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1px", marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-block", fontSize: 11, fontWeight: 600, letterSpacing: "1.2px",
      color: "var(--text-3)", textTransform: "uppercase", marginBottom: 12,
    }}>{children}</div>
  );
}

function Pillar({ num, title, line, body, color }: { num: string; title: string; line: string; body: string; color: string }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: 28,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ fontSize: 11, color, fontWeight: 600, letterSpacing: "1px", marginBottom: 14 }}>{num}</div>
      <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{title}</div>
      <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 12, lineHeight: 1.2 }}>{line}</h3>
      <p style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.65 }}>{body}</p>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 20,
    }}>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "var(--text)" }}>{title}</div>
      <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function FlowStep({ label, body, accent, success }: { label: string; body: string; accent?: boolean; success?: boolean }) {
  const color = success ? "var(--across-green)" : accent ? "#9d5cff" : "var(--text-3)";
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{
        flexShrink: 0,
        width: 28, height: 28, borderRadius: 8,
        background: success ? "rgba(109,245,178,0.12)" : accent ? "rgba(157,92,255,0.12)" : "var(--bg-elev)",
        border: `1px solid ${success ? "rgba(109,245,178,0.3)" : accent ? "rgba(157,92,255,0.3)" : "var(--border)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700, color,
      }}>
        {success ? "✓" : label.replace("Step ", "")}
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ fontSize: 11, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 2, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, color: "var(--text)" }}>{body}</div>
      </div>
    </div>
  );
}

function FlowConnector() {
  return <div style={{ marginLeft: 13.5, width: 1, height: 14, background: "var(--border)" }} />;
}
