Yes. For now, let's **ignore production, deployment, observability, security, LLMOps, and enterprise architecture**.

Focus on **core GenAI + LLM fundamentals** that interviewers commonly drill into, especially follow-up questions.

## Core GenAI & LLM Interview Questions

### 1. LLM Fundamentals

1. What is Generative AI?
2. What is an LLM?
3. How is an LLM different from a traditional ML model?
4. How does an LLM generate text?
5. What is a language model?
6. What does GPT stand for?
7. What is the difference between GPT and an encoder-based model?
8. What is a Transformer?
9. Why were Transformers introduced?
10. Why are Transformers better than RNNs for LLMs?
11. Explain the Transformer architecture.
12. What are the main components of a Transformer?
13. What is an encoder?
14. What is a decoder?
15. Encoder-only vs decoder-only vs encoder-decoder models?
16. Why are GPT models decoder-only?
17. What is self-attention?
18. Why is attention important in LLMs?
19. What are Query, Key, and Value?
20. How does the attention mechanism work?
21. What is multi-head attention?
22. Why do we need multiple attention heads?
23. What is causal attention?
24. Why can't GPT models attend to future tokens?
25. What is positional encoding?
26. Why does a Transformer need positional information?
27. What is the difference between positional encoding and positional embedding?
28. What is an LLM parameter?
29. What does it mean when a model has 7B, 70B, or 405B parameters?
30. Does a larger number of parameters always mean a better model?

---

## 2. Tokenization

31. What is tokenization?
32. Why don't LLMs directly process words?
33. What is a token?
34. Can one word contain multiple tokens?
35. Can one token contain multiple words?
36. What is subword tokenization?
37. What is BPE?
38. How does BPE work?
39. What is WordPiece?
40. BPE vs WordPiece?
41. What happens when the model encounters an unknown word?
42. Why does token count matter?
43. How does tokenization affect LLM cost?
44. How does tokenization affect context-window usage?
45. Why can the same sentence produce different token counts across models?

---

## 3. Embeddings

46. What is an embedding?
47. Why do we convert text into vectors?
48. How is an embedding generated?
49. What does an embedding vector represent?
50. What is semantic similarity?
51. How can two different sentences have similar embeddings?
52. What is cosine similarity?
53. Why is cosine similarity commonly used for embeddings?
54. Cosine similarity vs Euclidean distance?
55. What is the difference between an LLM and an embedding model?
56. Can the same LLM be used to generate embeddings?
57. What is a sentence embedding?
58. What is a document embedding?
59. What is a query embedding?
60. Why are embeddings important in RAG?

---

# 4. Training an LLM

61. How is an LLM trained?
62. What is pretraining?
63. What type of data is used during pretraining?
64. What is next-token prediction?
65. Explain next-token prediction with an example.
66. What is the training objective of a GPT model?
67. What is cross-entropy loss?
68. How does the model learn from prediction errors?
69. What is backpropagation?
70. What is gradient descent?
71. What are weights?
72. What are biases?
73. What is a gradient?
74. What is a learning rate?
75. What happens if the learning rate is too high?
76. What happens if the learning rate is too low?
77. What is batch size?
78. What is an epoch?
79. What is overfitting?
80. Can LLMs overfit?
81. What is underfitting?
82. What is a training checkpoint?
83. What is pretraining vs fine-tuning?

---

# 5. Fine-Tuning & Model Adaptation

84. What is fine-tuning?
85. Why do we fine-tune an LLM?
86. What is instruction tuning?
87. What is supervised fine-tuning?
88. What is RLHF?
89. What is DPO?
90. RLHF vs supervised fine-tuning?
91. RLHF vs DPO?
92. What is preference data?
93. What is reinforcement learning in LLMs?
94. What is a reward model?
95. What is LoRA?
96. What is PEFT?
97. Why is LoRA useful?
98. What is QLoRA?
99. LoRA vs QLoRA?
100. Fine-tuning vs prompting?

---

# 6. Inference & Text Generation

101. What happens when you send a prompt to an LLM?
102. Explain the complete flow from prompt → tokens → model → output.
103. What is inference?
104. What is autoregressive generation?
105. How does an LLM generate one token at a time?
106. What is a probability distribution over tokens?
107. How does the model select the next token?
108. What is greedy decoding?
109. What is temperature?
110. What happens when temperature = 0?
111. What happens when temperature is increased?
112. What is top-k sampling?
113. What is top-p sampling?
114. Top-k vs top-p?
115. Temperature vs top-p?
116. What is beam search?
117. Beam search vs greedy decoding?
118. Why can the same prompt produce different answers?
119. Why can temperature affect response creativity?
120. What is deterministic vs non-deterministic generation?

---

# 7. Context Window

121. What is a context window?
122. What counts toward the context window?
123. Input tokens vs output tokens?
124. What happens when the context window is exceeded?
125. Why does context-window size matter?
126. What is long-context reasoning?
127. Does a larger context window always improve model performance?
128. What problems occur when too much information is provided to an LLM?
129. What is the "lost in the middle" problem?
130. How does an LLM use previous conversation history?

---

# 8. Prompt Engineering Basics

131. What is prompt engineering?
132. What is a system prompt?
133. What is a user prompt?
134. What is an assistant message?
135. System prompt vs user prompt?
136. What is zero-shot prompting?
137. What is one-shot prompting?
138. What is few-shot prompting?
139. Zero-shot vs few-shot prompting?
140. What is role prompting?
141. What is instruction prompting?
142. What is chain-of-thought prompting?
143. What is structured prompting?
144. What makes a good prompt?
145. Why does prompt wording affect LLM output?
146. How do you give constraints to an LLM?
147. How do you ask an LLM to return JSON?
148. How do you make an LLM follow a specific output format?
149. What is prompt chaining?
150. What is the difference between prompt engineering and fine-tuning?

---

# 9. Hallucination & Reasoning

151. What is an LLM hallucination?
152. Why do LLMs hallucinate?
153. Does an LLM actually "know" facts?
154. Is an LLM a database?
155. Why can an LLM confidently provide an incorrect answer?
156. What is factuality?
157. What is grounding?
158. What is the difference between hallucination and incorrect reasoning?
159. Can hallucinations be completely eliminated?
160. Why does providing context sometimes reduce hallucination?
161. Why can an LLM still hallucinate even when correct context is provided?
162. What is reasoning in LLMs?
163. What is chain-of-thought?
164. What is step-by-step reasoning?
165. What is the difference between memorization and reasoning?

---

# 10. RAG Fundamentals

166. What is RAG?
167. Why was RAG introduced?
168. RAG vs fine-tuning?
169. RAG vs prompting?
170. Explain a basic RAG pipeline.
171. What happens during document ingestion?
172. What is document chunking?
173. Why do we chunk documents?
174. What is an embedding model's role in RAG?
175. What is vector search?
176. How does semantic search work?
177. What is a vector database?
178. What is retrieval?
179. What is reranking?
180. What is context augmentation?
181. What happens after documents are retrieved?
182. How does the LLM generate an answer using retrieved documents?
183. What is the difference between retrieval and generation?
184. What happens if RAG retrieves irrelevant documents?
185. What happens if RAG fails to retrieve the correct document?
186. What is hybrid search?
187. Keyword search vs semantic search?
188. Why combine keyword and vector search?
189. What is metadata filtering?
190. What is query rewriting?

---

# 11. Core Conceptual Follow-Up Questions

These are the questions an interviewer may ask **immediately after your first answer**:

191. Why?
192. How exactly does that work internally?
193. Can you explain with a simple example?
194. What happens step by step?
195. What problem does this solve?
196. Why is this better than the traditional approach?
197. What are the limitations?
198. When would you NOT use this approach?
199. What is the difference between these two approaches?
200. Can you explain it without using a framework?
201. Can you implement a basic version in Python?
202. What happens internally?
203. What happens if the input is very large?
204. What happens if the model gives an incorrect answer?
205. How would you debug it?

### Priority for your current preparation

I would study in this order:

**LLM fundamentals → Transformer → Attention → Tokenization → Embeddings → Training → Fine-tuning → Inference → Sampling → Context Window → Prompt Engineering → Hallucination → RAG basics.**

That gives you the **core conceptual foundation** before we move into production and advanced Agentic AI.


Yes — **next level means deeper LLM/GenAI interview questions**, where the interviewer expects you to explain **why, how internally, trade-offs, and mathematical intuition**, not just definitions.

## 1. Transformer — Deep Interview Questions

1. Explain the complete Transformer architecture from input tokens to output tokens.
2. Why does self-attention have \(O(n^2)\) complexity?
3. Derive the attention equation: `softmax(QKᵀ / √d)V`.
4. Why do we divide `QKᵀ` by `√d`?
5. What happens if we don't use the scaling factor?
6. Why is softmax used in attention?
7. What exactly do Query, Key, and Value represent?
8. How are Q, K, and V generated from token embeddings?
9. Why are Q, K, and V separate matrices?
10. What is the dimensionality of Q, K, and V?
11. How does multi-head attention work internally?
12. Why not use one large attention head?
13. How does each attention head learn different relationships?
14. What happens after multi-head attention?
15. What is the purpose of the feed-forward network?
16. Why does the Transformer need both attention and an FFN?
17. What is the purpose of residual connections?
18. Why is LayerNorm used?
19. LayerNorm vs BatchNorm?
20. What is the difference between Pre-LN and Post-LN Transformers?
21. Why are Transformer models easier to parallelize than RNNs?
22. What is causal masking?
23. How is the causal attention mask implemented?
24. Why does a decoder-only Transformer use causal masking?
25. What would happen if causal masking were removed during GPT training?

---

# 2. Attention — Deeper Questions

26. Suppose the sequence contains 5 tokens. What are the dimensions of Q, K, V?
27. How is the attention score calculated between two tokens?
28. What does a high attention score mean?
29. What does the attention matrix represent?
30. Why is the attention matrix square?
31. How does attention capture long-range dependencies?
32. How does attention know which words are related?
33. Can attention identify relationships between distant tokens?
34. What is cross-attention?
35. Self-attention vs cross-attention?
36. Where is cross-attention used?
37. Why doesn't GPT normally use cross-attention?
38. How does attention differ from traditional similarity search?
39. What is attention head specialization?
40. What is attention sparsity?
41. What is grouped-query attention?
42. What is multi-query attention?
43. MHA vs MQA vs GQA?
44. Why are GQA and MQA useful for LLM inference?

---

# 3. Tokenization — Advanced

45. Why does tokenization affect model performance?
46. Why can tokenization differ between LLMs?
47. Why can programming code tokenize differently from natural language?
48. Why can non-English languages require more tokens?
49. How does tokenization affect context-window utilization?
50. How does tokenization affect inference cost?
51. How would you choose a tokenizer for a new LLM?
52. What is vocabulary size?
53. What happens if vocabulary size is extremely large?
54. What happens if vocabulary size is extremely small?
55. What is the relationship between vocabulary size and embedding matrix size?

---

# 4. Embeddings — Deep Questions

56. How is the token embedding matrix learned?
57. What does an embedding dimension represent?
58. Why might a model use 768, 1536, or 4096-dimensional embeddings?
59. Does every dimension correspond to a human-understandable feature?
60. Why can semantically similar sentences have similar vectors?
61. How does cosine similarity actually work mathematically?
62. Cosine similarity vs dot product?
63. Why can vector normalization matter?
64. What is embedding space?
65. What is the curse of dimensionality?
66. Why doesn't increasing embedding dimensions indefinitely improve retrieval?
67. What is embedding drift?
68. What happens if you change your embedding model after documents are indexed?
69. Why must query and document embeddings generally come from compatible embedding spaces?

---

# 5. LLM Training — Deep Questions

70. Explain the complete training loop of an LLM.
71. What happens during forward propagation?
72. What happens during backpropagation?
73. How is the loss calculated?
74. How are model weights updated?
75. What is cross-entropy loss doing in next-token prediction?
76. Why is softmax used before cross-entropy?
77. What is a logit?
78. Logits vs probabilities?
79. What happens if one token has a very high logit?
80. What is gradient descent doing geometrically?
81. What is vanishing gradient?
82. What is exploding gradient?
83. How do Transformers address gradient-related problems?
84. What is gradient clipping?
85. What is weight initialization?
86. Why is initialization important?
87. What is learning-rate warmup?
88. What is a learning-rate scheduler?
89. What is Adam/AdamW?
90. Why is Adam commonly used for LLM training?
91. Adam vs SGD?
92. What is weight decay?
93. What is gradient accumulation?
94. Why is gradient accumulation useful for LLM training?
95. What is mixed-precision training?
96. FP32 vs FP16 vs BF16?
97. Why is BF16 commonly used for large-model training?

---

# 6. Pretraining — Advanced

98. What happens during LLM pretraining?
99. How is the training dataset constructed?
100. Why is data quality important?
101. What happens if the training data contains duplicates?
102. What is data deduplication?
103. Why remove low-quality training data?
104. What is data contamination?
105. What is benchmark contamination?
106. What is next-token prediction actually teaching the model?
107. Why does next-token prediction lead to emergent capabilities?
108. Does an LLM store training documents exactly?
109. What is memorization?
110. Memorization vs generalization?
111. How does model size affect generalization?
112. What is scaling law?
113. What are compute-optimal scaling laws?
114. Why isn't parameter count alone sufficient to compare models?
115. What is the relationship between parameters, tokens, and compute?

---

# 7. Fine-Tuning — Advanced

116. What exactly changes during fine-tuning?
117. Does fine-tuning change all model parameters?
118. Full fine-tuning vs PEFT?
119. How does LoRA work mathematically?
120. Why does LoRA reduce trainable parameters?
121. What are LoRA matrices A and B?
122. What is the LoRA rank?
123. What happens if LoRA rank is too small?
124. What happens if LoRA rank is too large?
125. What is QLoRA doing differently?
126. Why can quantized models still be fine-tuned?
127. What is catastrophic forgetting?
128. How do you detect catastrophic forgetting?
129. How do you prevent catastrophic forgetting?
130. How do you decide whether to fine-tune or use RAG?
131. Can fine-tuning add new factual knowledge reliably?
132. Can fine-tuning teach a model a new behavior?
133. Can RAG and fine-tuning be used together?

---

# 8. Inference — Deep Questions

134. Explain LLM inference step by step.
135. What happens internally when you send a prompt?
136. What is the prefill phase?
137. What is the decode phase?
138. Prefill vs decode?
139. Why is prefill compute-intensive?
140. Why is decoding often memory-bandwidth-intensive?
141. What is KV cache?
142. Why is KV cache necessary?
143. What information is stored in KV cache?
144. How does KV cache reduce computation?
145. What happens to KV-cache memory as context length increases?
146. Why does long-context inference consume significant memory?
147. What is time-to-first-token (TTFT)?
148. What is tokens-per-second?
149. What is inter-token latency?
150. Why can the first token take longer than subsequent tokens?
151. What is speculative decoding?
152. How can speculative decoding improve generation speed?

---

# 9. Generation & Sampling — Deep

153. What exactly is a logit?
154. How are logits converted into probabilities?
155. What does temperature mathematically do to logits?
156. Why does temperature < 1 make outputs more deterministic?
157. What happens when temperature approaches 0?
158. What happens when temperature is very high?
159. Explain top-k sampling mathematically.
160. Explain top-p sampling mathematically.
161. What happens when top-p is set very low?
162. Why can high temperature increase hallucination?
163. Greedy decoding vs sampling?
164. Beam search vs sampling?
165. Why isn't beam search always better for LLMs?
166. What is repetition penalty?
167. Why do LLMs repeat themselves?
168. What causes degenerate generation?

---

# 10. Context & Long-Context LLMs

169. Why does an LLM have a finite context window?
170. What determines the maximum context length?
171. What happens internally as context length increases?
172. Why does attention become expensive for long contexts?
173. What is quadratic attention complexity?
174. How do modern models support very long contexts?
175. What is RoPE?
176. Why is RoPE used in modern LLMs?
177. How does RoPE encode positional information?
178. What is RoPE scaling?
179. What is ALiBi?
180. RoPE vs traditional positional embeddings?
181. What is long-context degradation?
182. What is the "lost in the middle" problem?
183. Why doesn't an LLM necessarily use every piece of context equally?

---

# 11. Hallucination — Deep

184. Why does an LLM hallucinate from a probabilistic perspective?
185. Is hallucination a model bug or a consequence of generative modeling?
186. Why can an LLM generate plausible but false information?
187. What is the relationship between probability and factuality?
188. Why doesn't the highest-probability answer necessarily mean the answer is true?
189. How does temperature influence hallucination?
190. How does missing context contribute to hallucination?
191. Why can an LLM hallucinate even when given correct context?
192. What is grounding?
193. What is attribution?
194. How can retrieval reduce hallucination?
195. Why doesn't RAG completely eliminate hallucination?
196. What is factual consistency?
197. How would you distinguish retrieval failure from generation failure?

---

# 12. RAG — Next-Level Fundamentals

198. Explain RAG mathematically at a high level.
199. What exactly happens between the user query and retrieved documents?
200. How is a query converted into an embedding?
201. How are documents converted into embeddings?
202. How is similarity calculated?
203. How does top-K retrieval work?
204. Why might the most similar document still be irrelevant?
205. What is semantic similarity vs factual relevance?
206. Why do we need reranking?
207. How does a cross-encoder reranker differ from embedding retrieval?
208. Bi-encoder vs cross-encoder?
209. What is hybrid retrieval?
210. How does BM25 work?
211. Why can BM25 outperform vector search for exact terms?
212. Why can vector search outperform BM25 for semantic queries?
213. How does hybrid retrieval combine both?
214. What is Reciprocal Rank Fusion?
215. Why does chunk size affect retrieval quality?
216. Why does chunk overlap matter?
217. What happens when chunks lose their surrounding context?
218. What is contextual chunking?
219. What is parent-child retrieval?
220. How would you diagnose whether a RAG failure came from **chunking, embedding, retrieval, reranking, or generation**?

---

## 13. Very Common "Interviewer Drilling" Questions

These are especially important because after you answer a basic question, the interviewer may immediately go deeper:

221. **Why?**
222. **How does it work internally?**
223. **Can you explain mathematically?**
224. **Can you give a concrete example?**
225. **What happens step by step?**
226. **What is happening inside the model?**
227. **What are the alternatives?**
228. **Why would you choose one over another?**
229. **What are the limitations?**
230. **What happens in an edge case?**
231. **What happens if the input is extremely large?**
232. **What happens if the model produces an incorrect output?**
233. **How would you debug it?**
234. **Can you implement a simplified version in Python?**
235. **What is the computational complexity?**
236. **What is the memory complexity?**
237. **What happens during training vs inference?**
238. **What changes if we increase the model size?**
239. **What changes if we increase context length?**
240. **What changes if we change the temperature?**

**This is the level I would use for your next preparation stage:** not just *“What is attention?”*, but *“Why do we divide QKᵀ by √d, what happens without scaling, and what is the computational complexity?”* That is where GenAI interviews usually become significantly more technical.

