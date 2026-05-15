# Ring x Across PoC

BD pitch and live cross-chain swap demo for Ring Protocol, powered by the Across Swap API.

## Routes

- `/` — One-pager BD pitch
- `/swap` — Mirrored Ring Swap UI with a third tab: **Cross-chain** (live Across Swap API)
- `/api/swap-approval` — Server proxy to `POST /swap/approval` on Across
- `/api/swap-status` — Server proxy to deposit status

## Stack

Next.js 14, TypeScript, wagmi v2, RainbowKit, viem.

## Env

```
ACROSS_API_KEY=...
ACROSS_INTEGRATOR_ID=0x00f0
```

## Local

```
npm install
npm run dev
```

## Notes

- Uses `/swap/approval` exclusively. No `/suggested-fees`.
- Origin chains: ETH, OP, ARB, Base, Unichain.
- Destination chains: ETH, ARB, Base, Unichain, HyperEVM.
