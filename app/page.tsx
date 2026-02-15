"use client";

import { useState } from "react";

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!imageUrl) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Visual Product Matcher</h1>

      <input
        type="text"
        placeholder="Paste image URL..."
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "30px" }}>
        {results.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100px", marginBottom: "10px" }}
            />
            <h3>{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Similarity: {product.score.toFixed(4)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
