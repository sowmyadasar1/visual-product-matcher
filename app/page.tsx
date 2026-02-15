"use client";
import { useState } from "react";
import ImageSearch from "@/components/ImageSearch";
import ResultsGrid from "@/components/ResultsGrid";

type ProductMatch = {
  id: string;
  name: string;
  image: string;
  category: string;
  score: number;
};

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [results, setResults] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (image: string) => {
    if (!image) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
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

  <ImageSearch
    imageUrl={imageUrl}
    setImageUrl={setImageUrl}
    onSearch={handleSearch}
    loading={loading}
  />

  {error && <p style={{ color: "red" }}>{error}</p>}

  <ResultsGrid results={results} />
</main>

  );
}
