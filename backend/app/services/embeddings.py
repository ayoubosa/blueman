"""Text embeddings for RAG.

Uses a deterministic local embedding by default (hash-based projection) so
the whole stack runs with zero external embedding dependency; swap
`embed_texts` for Voyage/OpenAI/SentenceTransformers in production by
changing ONLY this module — the interface stays [text] -> [vector].
"""
import hashlib
import math

from app.core.config import get_settings


def _hash_embed(text: str, dim: int) -> list[float]:
    """Cheap, deterministic bag-of-ngrams projection. Good enough for
    development and keyword-ish recall; replace with a real model for
    semantic quality (see module docstring)."""
    vec = [0.0] * dim
    tokens = text.lower().split()
    ngrams = tokens + [" ".join(p) for p in zip(tokens, tokens[1:])]
    for gram in ngrams:
        h = int.from_bytes(hashlib.md5(gram.encode()).digest()[:8], "big")
        vec[h % dim] += 1.0
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


async def embed_texts(texts: list[str]) -> list[list[float]]:
    dim = get_settings().embedding_dim
    return [_hash_embed(t, dim) for t in texts]


async def embed_query(text: str) -> list[float]:
    return (await embed_texts([text]))[0]
