# Ring x Across PoC

One-pager BD pitch and live cross-chain swap demo for Ring Protocol, built on the Across Swap API.

## Routes

- `/` — BD pitch deck (hero, opportunity, security, cost comparison, coverage, partners, credentials, CTA)
- `/swap` — Mirrored Ring Swap UI with a third tab: **Cross-chain** (live Across Swap API)
- `/api/swap-approval` — Server proxy to `GET /swap/approval` on Across
- `/api/swap-status` — Server proxy to deposit status

## Stack

Next.js 14, TypeScript, wagmi v2, RainbowKit, viem.

## Demo chains

| | Sources | Destinations |
| --- | --- | --- |
| Chain IDs | 1, 10, 42161, 8453, 81457 | 1, 42161, 8453, 81457, 999, 1337 |
| Names | Ethereum, Optimism, Arbitrum, Base, Blast | Ethereum, Arbitrum, Base, Blast, HyperEVM, HyperCore |

Tokens: ETH, USDC, USDT (chain-aware decimals: HyperCore stables use 8, EVM stables use 6, native ETH 18).

## Env

```
ACROSS_API_KEY=...
ACROSS_INTEGRATOR_ID=0x0155
```

## Local

```
npm install
npm run dev
```

## Notes

- Uses `GET /swap/approval` exclusively. Never `/suggested-fees`.
- `tradeType=exactInput` everywhere (user types input amount, sees output).
- Output decimals come from the API response (`quote.outputToken.decimals`) for defensive correctness on cross-decimal routes like HyperCore (USDC-SPOT is 8 dec).
- "Total fee" reads `quote.fees.total.pct` (the all-in figure) rather than `steps.bridge.fees.pct`.
- Sponsored routes (`fees.total.pct === 0`) render with a green "FREE · SPONSORED" badge in the demo.
