# ⚡ Agentic World Mastery — Engineering 100M+ Scale Agentic Systems

An interactive, self-contained textbook and 3D/2D simulation laboratory for mastering planetary-scale AI agent engineering (**100M+ DAU**).

## 🧭 Core Curriculum Pillars (5 Modules • 10 Encyclopedic Lessons)

1. **Module 1: Agentic Development & Neuro-Symbolic Cognitive Architectures**
   - Formal POMDP derivations, ReAct vs. ReWOO (Parallel DAGs) vs. Reflexion vs. LATS (Monte Carlo Tree Search / UCT).
   - CEGAR Neuro-Symbolic Constraint Verification (LLM semantic lifting + CSP solver + UNSAT-core relaxation).
   - Constrained Decoding (XGrammar PDA bitmasking, SGLang Jump-Forward), Model Context Protocol (MCP) JSON-RPC 2.0 wire spec, Dynamic Tool-RAG, and Google DeepMind **CaMeL** taint-tracked sandboxing.
2. **Module 2: Agent Orchestration, Durable Execution & Multi-Agent Swarms**
   - Event-sourced deterministic replay (**Temporal.io / Restate** Write-Ahead Logs), **LangGraph** Pregel BSP super-steps, zero-compute HITL interrupts, HMAC idempotency keys, and LIFO Saga compensation.
   - Sub-10ms Neural Semantic Routers, **RouteLLM** Bradley-Terry complexity cascades, the **A2A Protocol**, and cures for the 14 MAST multi-agent failure modes.
3. **Module 3: Hyperscale AI Inference Engineering & GPU Kernel Physics**
   - H100/B200 Roofline arithmetic intensity ($295\text{ FLOPs/Byte}$), exact KV-cache sizing across **MHA, GQA, and DeepSeek MLA** (low-rank latent compression).
   - **FlashAttention-2/3** online safe softmax, **vLLM PagedAttention** vs. **SGLang RadixAttention** LRU prefix trees.
   - Disaggregated Prefill/Decode (**DistServe / Mooncake**) over 400Gbps GPUDirect RDMA, Lossless Speculative Decoding (**EAGLE-2**), and **FP8 (E4M3) / INT4 AWQ** quantization.
4. **Module 4: Hyperscale AI System Architecture (100M+ DAU Control & Data Planes)**
   - Complete 100M DAU capacity & H100 fleet sizing worksheet (1.5B LLM calls/day, 52k Peak QPS, Little's Law concurrency).
   - Cache-Aware Bounded-Load Consistent Hashing, **S-LoRA** Segmented Gather-Matrix-Multiply, Multi-Region Active-Active failover, **Netflix Gradient2** adaptive concurrency control, 4-stage brownout cascades, and **Negation/Entity-Safe Semantic Caching**.
5. **Module 5: AI System Data — Petabyte Memory, OTel Tracing & DeepSeek GRPO Flywheels**
   - **CoALA** 4-Tier Cognitive Memory, **MemGPT/Letta** virtual context paging, **Bi-Temporal GraphRAG (Zep/Graphiti)** edge invalidation, and **1-Bit Binary Quantization (BQ) + DiskANN**.
   - **OpenTelemetry GenAI** span schemas and the post-training RL flywheel (**RFT → DPO → DeepSeek GRPO** with verifiable CSP rewards and observation masking).

## 🛠️ Local Development

```bash
bun install
bun run dev
```

## 📦 Portable Curriculum Dataset

The complete, self-contained curriculum specification (HTML textbook chapters, 3D Three.js scene graphs, 2D DAGs, SVG diagrams, verified YouTube lectures, foundational papers, production Python implementations, and 30 mastery quiz questions) is stored in [`agentic_mastery_curriculum.json`](./agentic_mastery_curriculum.json).
