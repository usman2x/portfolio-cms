## Case Study: Error Reprocessing Tool (ERT) Data Pipeline

An enterprise-grade data observability and recovery pipeline built on Kafka and Azure, orchestrating the zero-loss migration of millions of legacy on-premise database records to Azure Cloud daily.

## The Problem
High-volume on-premise cloud migrations frequently stall due to data pipeline errors. Without granular, real-time observability down to the domain level, data engineering teams struggle to isolate root causes, resulting in manual debugging overhead and high migration failure risks.

## Engineering Features & Direct Impact

* Horizontally Scalable ERT Sync Engine: Pairs Spring Boot with Azure Event Hubs (Kafka) inside Azure Container Instances to consume error events, partitioning data streams cleanly by domain into structured Azure SQL instances.
* Bi-Directional ERT Reprocessing API: Exposes RESTful endpoints using Spring Boot to query, filter, and push failed migration events back to their native Kafka topics for immediate, granular or batch recovery.
* High-Observability ERT Dashboard UI: Visualizes the live migration status of complex domains and subdomains, giving developers a centralized interface to inspect errors and manually replay records.
* Automated ERT Retries & Scheduler: Executes background polling against the persistence layer to automatically scan for pending errors, initiating automated retry workflows based on predefined, configurable business logic.
* Containerized Cloud Architecture: Standardizes the deployment footprint across Azure Container Instances, Azure Event Hubs, and Azure SQL, ensuring reliable multi-market pipeline setups and zero-downtime scalability.

## The Bottom Line

* The System: Established an end-to-end telemetry and automated recovery pipeline handling millions of records daily with absolute data transparency.
* The Business: Drastically reduced cloud migration risks and engineering overhead by replacing blind manual debugging with self-healing data workflows.

## Technical Stack
* Spring Boot
* Apache Kafka
* Azure
* ReactJs

## Link
* Walmart Inhouse product

