## Case Study: Engineering Transformation of a French P2P Classifieds Platform

Transformed an unoptimized, "vibe-coded" P2P marketplace into a data-backed, high-retention AI product, stabilizing user retention at 80% and launching the platform's first subscription model.

## The Problem
The early-stage platform suffered from slow feature delivery, low team morale, and an inconsistent FastAPI codebase. Memory leaks, data duplication, and a lack of telemetry left management without the user journey or AI consumption data needed to build monetization engines.

## Engineering Features & Direct Impact

* FastAPI Standardization & Refactoring: Restructured fragmented FastAPI repositories into a uniform architecture with strict directory organization, eliminating technical debt and resolving persistent database session leaks.
* Data Consistency & Integrity Layer: Fixed data reflection and duplication bugs within the database layer, implementing automated QA checks to validate queries and guarantee reliable records.
* User Journey Telemetry: Built an end-to-end event-tracking pipeline that maps funnel friction points, providing management with the user behavior data needed to stabilize retention at 80%.
* AI Observability & Monitoring: Deployed a dedicated AI observability layer to track runtime prompts, system performance, and consumption metrics for optimal platform governance.
* Monetization Engine & Premium Plans: Engineered a subscription billing infrastructure and premium feature gates, allowing high-tier users to buy plans without overloading core services.
* High-Level Ad Lifecycle Systems: Re-architected the ad publishing and delivery workflow to increase item visibility while controlling free-tier system resource consumption.
* Agile Velocity & AI Tooling: Streamlined sprint rituals and introduced AI-assisted coding through structured Cursor guidelines, accelerating engineering velocity with the exact same team size.

## The Bottom Line

* The System: Upgraded an unstable codebase into a structured, observable AI platform with built-in telemetry and a zero-downtime refactoring deployment cycle.
* The Business: Shifted operations from guesswork to data-backed execution, securing 80% user retention and launching premium subscription streams.

## Technical Stack
* FastAPI
* PostgresSQL (pgvector)
* OpenAI
* LangChain
* Flutter

## Links
1. https://streetapp.com

