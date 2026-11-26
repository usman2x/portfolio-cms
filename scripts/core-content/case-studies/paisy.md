Paisy is a stablecoin money app where users hold digital dollars in their own wallet, spend them with a card and send them abroad, and its V1 went from proofs of concept to a working dev release built by engineers in India and Pakistan under one engineering manager.

## The problem

Stablecoin wallets are hard for ordinary users, and card products built on them often hold the user's money. Paisy needed a V1 where users keep control of their funds, add money from a bank or from crypto, spend with a card and pay out to bank accounts abroad, while a distributed team new to the domain delivered it against vendors whose real behaviour was not yet known.

## Role and responsibilities

* 360 Ownership: Ran Paisy end to end across product, architecture, vendors, R&D, compliance design, delivery and quality, as the single point between the business and the engineering teams.
* Team Building and Onboarding: Worked with a six-engineer vendor team in India and onboarded two developers, a DevOps engineer and a QA engineer in Pakistan, aligning everyone to the Paisy vision, scope and ways of working.
* Daily Alignment and Work Review: Ran daily meetings, reviewed the team's work, and kept decisions written down so nothing lived only in chat.
* Proofs of Concept and R&D: Built proofs of concept and researched how the underlying systems actually behave, including Dynamic's MPC wallets, gas sponsorship and Flow deposits, and Rain's KYC, card issuing, virtual accounts and payouts, with their edge cases.
* Foundation for AI-Assisted Development: Turned the PoC findings, use cases and edge cases into precise specifications that drove AI-assisted development of the app, API and admin panel.
* Architecture and Vendor Selection: Chose the vendor stack, set non-custody and Paisy-owned identity as written decisions, and designed fund flows, the ledger model and the deposit state machine.
* Compliance by Design: Designed KYC/AML operations, sanctions screening, maker-checker (four-eyes) approvals, audit trails, card disputes and the limits of freezing a self-custodied wallet.
* Quality and Release: Mapped 21 end-to-end journeys to 106 use cases and wrote test suites for cards, bank deposits, crypto receipts, compliance controls and broadcasts against the vendor sandboxes.
* Cloud and Delivery Governance: Set branch protection, pull-request approvals and a CI/CD hardening plan on AWS, and tracked infrastructure and security issues with evidence.

## Engineering features & direct impact

* Non-Custodial MPC Wallets: Each user gets an embedded TSS-MPC wallet (a key share on the phone and one with the provider, never a full key) holding one balance in USDC on Base, so Paisy holds no customer funds and network fees are sponsored.
* Crypto Deposits: Users receive USDC on Base directly to their wallet address, and USDT or USDC from other EVM chains, Solana or TRON are built to be converted on arrival through one-time deposit addresses, so users see one balance whichever network they send from.
* Card Issuing and Spending: Virtual Visa cards spend the wallet balance through a one-time token approval, with card controls, tiers, orders, authorisation, settlement and reversal handling, customer disputes, and physical cards ready behind a setting.
* Bank Deposits: A US virtual account in the user's name takes ACH and wire transfers and converts them to stablecoin in the wallet.
* Global Payouts: Users pay out to bank accounts abroad through payout corridors (for example SEPA in euros) with a locked FX quote, the fee shown up front and the network fee paid by Paisy.
* Onboarding and KYC: Sign-up, identity verification and referral rewards run in one flow, with customers approved at sign-up instead of a waitlist.
* Compliance and Screening: Wallets are screened at sign-in and transactions at signing, a refused signing is recorded with a plain-English reason and an ops alert, and sensitive admin actions need four-eyes approval with a full audit trail.
* Ledger and Webhook Pipeline: Signed partner events are verified, stored once, processed in the background and reconciled to a single ledger entry matched by transaction hash, so no deposit is credited twice.
* Traceability and Observability: Every payment, deposit, payout and card transaction has a short Payment ID that links app, admin, logs and vendor idempotency keys, with failure records, structured logs and Sentry error tracing.
* Admin Operations Console: Admins investigate deposits from provider state to on-chain hash and handle exceptions, compliance reviews, payments, disputes, card orders, FAQs, home banners and network-fee policy.

## The bottom line

* The System: A React Native app for iOS and Android, a Node.js API on AWS with PostgreSQL and a Next.js admin panel, integrated with Dynamic and Rain and running as a dev release since 15 Nov 2026.
* The Business: Wallets, deposits, cards, bank accounts and global payouts work end to end on the dev environment, built on researched vendor behaviour, so the remaining work is launch readiness rather than discovery.
* What's Next: Production launch on mainnet, multi-chain deposits through Flow once enabled, and physical cards.

## Technical stack
* React Native (Expo), iOS and Android
* Node.js, Express, Next.js admin panel
* PostgreSQL on AWS RDS
* AWS: ECS Fargate, CloudFront, SES, Secrets Manager, CloudWatch, CodePipeline
* Dynamic embedded wallets (TSS-MPC), gas sponsorship and screening
* Dynamic Fireblocks Flow for deposit conversion
* USDC on Base
* Rain for KYC, card issuing, US virtual accounts and payouts
* Sentry
* Figma design system
* ClickUp and written decision records

## Links
1. https://paisy.com
