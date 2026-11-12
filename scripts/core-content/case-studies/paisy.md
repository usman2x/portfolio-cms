Paisy is a stablecoin money app where users hold digital dollars in their own wallet and spend them with a card, and its V1 is being built by a six-developer team under one engineering manager.

## The problem

Stablecoin wallets are hard for ordinary users, and card products built on them often hold the user's money. Paisy needed a V1 where users keep control of their funds, add money from a bank or from crypto, and spend with a card, while a small outsourced team delivered it with clear scope and decisions.

## Engineering features & direct impact

* Non-Custodial Wallets: Each user gets an embedded wallet holding one balance in USDC on Base, so the money sits with the user, the company holds no customer funds and network fees are sponsored.
* Multi-Chain Deposits: USDT and USDC sent from EVM chains, Solana or TRON are designed to be converted on arrival into USDC on Base, so users see one balance whichever network they send from.
* Card Spending: Virtual cards, with physical cards later, spend the wallet balance through a one-time approval, so new deposits are usable on the card with no top-up step.
* Bank Deposits: A US account in the user's name takes ACH and wire transfers and converts them to stablecoin in the wallet.
* Onboarding and KYC: Sign-up, waitlist, identity checks and referral rewards run through one flow with admin approval.
* Compliance Operations: Designed so every incoming deposit is screened, with set actions per risk level, four-eyes approval and a full audit trail; because funds in a user's own wallet can't be frozen, flagged accounts lose card and send access instead.
* Webhook Pipeline: Signed partner events are verified, stored once, processed in the background and matched to a single ledger entry, so no deposit is credited twice.
* Proven Before Build: A testnet proof of concept showed company-owned login with the wallet provider underneath, wallet creation, sends by username, deposit detection, sponsored gas and key export before the team built them.
* Branded Email: Ten transactional email templates from the Paisy address cover codes, referrals, waitlist and admin alerts.
* Delivery Process: One ClickUp board, architecture, compliance and flow documents with sequence diagrams and mock screens, and written decisions replaced chat-only coordination.

## The bottom line

* The System: A React Native app for iOS and Android, a Node.js API on AWS with PostgreSQL, and a Next.js admin panel, connected to wallet, deposit-conversion, card and screening partners, with the wallet flows proven in a testnet proof of concept.
* The Business: V1 scope, partners, fund flows and the compliance model are fixed and documented, so the team builds against one plan.
* What's Next: Multi-chain deposits, physical cards and global payouts.

## Technical stack
* React Native (Expo), iOS and Android
* Node.js, Express, Next.js admin panel
* PostgreSQL on AWS RDS
* AWS: ECS Fargate, CloudFront, SES, Secrets Manager, CloudWatch, CodePipeline
* Dynamic embedded wallets (TSS-MPC)
* Dynamic Fireblocks Flow for deposit conversion
* USDC on Base
* Rain for KYC, cards and US account
* Chainalysis transaction screening
* Figma design system
* ClickUp and written decision records

## Links
1. https://paisy.com
