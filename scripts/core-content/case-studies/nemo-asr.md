## Case Study: Real-Time Audio Streaming & ASR Pipeline

An end-to-end, full-stack streaming pipeline integrating an Angular frontend with an NVIDIA NeMo ASR server via Java Spring Boot WebSockets for real-time speech recognition.

## The Problem
Processing live audio data requires low-latency, bi-directional communication channels. Standard HTTP protocols introduce too much delay for streaming voice data, causing lag between user speech and live text transcriptions while complicating the pipeline between frontend UIs and hardware-accelerated AI models.

## Engineering Features & Direct Impact

* Low-Latency WebSocket Middleware: Deploys a full-duplex Java Spring Boot WebSocket server to handle concurrent, bi-directional audio binary streaming and immediate text transcription returns.
* Hardware-Accelerated AI Bridge: Connects the core enterprise Java middleware layer to a standalone, Python-based NVIDIA NeMo Automatic Speech Recognition (ASR) engine for high-throughput voice processing.
* Reactive Streaming Frontend: Architects an asynchronous Angular application that captures live user audio inputs, streaming chunked binary packets across the tech stack without blocking the UI thread.
* Cross-Stack Event Coordination: Standardizes internal data models between the TypeScript frontend, Java orchestration engine, and Python AI service to maintain cross-stack message order and structural consistency.


## The Bottom Line

* The System: Connected an Angular client interface directly to deep learning hardware nodes using a scalable, reactive WebSocket framework.
* The Business: Delivered a responsive, real-time speech-to-text platform tailored to client requirements with zero perceptible transcription delay.

## Technical Stack
* NVIDIA NeMo Automatic Speech Recognition (ASR)
* Python
* Angular
* Java and SpringBoot

## Links
1. Demo: [https://drive.google.com/file/d/19rYpThcoqBSdHyA163a_nMHDv8luDS2V/view?usp=drive_link](https://drive.google.com/file/d/1_RLgkrZRlkvh_dnps7LcfZ7FjPr3hKKP/view?usp=drive_link)
2. https://github.com/usman2x/nemo_asr_websocket
3. https://github.com/usman2x/websocket-poc
4. https://github.com/usman2x/audio-transcription-app

