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
  const [resultLimit, setResultLimit] = useState(10);

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

  const handleClear = () => {
    setImageUrl("");
    setResults([]);
    setError("");
    setResultLimit(10);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 text-center mb-2">
          Visual Product Matcher
        </h1>

        <p className="text-center text-gray-600 mb-10">
          Upload an image or paste a URL to find visually similar products.
        </p>

        <ImageSearch
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={loading}
        />

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}

        {results.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Showing {Math.min(resultLimit, results.length)} of {results.length} results
            </p>

            <select
              value={resultLimit}
              onChange={(e) => setResultLimit(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value={5}>Top 5</option>
              <option value={10}>Top 10</option>
            </select>
          </div>
        )}

        <ResultsGrid results={results.slice(0, resultLimit)} />
      </div>
    </main>
  );
}
