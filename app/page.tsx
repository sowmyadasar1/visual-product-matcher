"use client";

import { useState, useMemo } from "react";
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
  const [results, setResults] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultLimit, setResultLimit] = useState(10);
  const [searchedImage, setSearchedImage] = useState<string | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [threshold, setThreshold] = useState(0.2);

  const getConfidence = (score: number) => {
    if (score > 0.85) return "Very High";
    if (score > 0.75) return "High";
    if (score > 0.6) return "Moderate";
    return "Low";
  };

  const handleSearch = async (file?: File, previewUrl?: string, url?: string) => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (url) formData.append("url", url);

      const res = await fetch("/api/match", {
        method: "POST",
        body: formData,
        cache: "no-store",
      });

      let data;

      try {
        data = await res.json();
      } catch {
        throw new Error("Server returned empty response.");
      }

if (!res.ok || !Array.isArray(data)) {
  throw new Error(data?.error || "Search failed.");
}


      setResults(data);
      if (previewUrl) setSearchedImage(previewUrl);
      setConfidenceFilter("All");
      setCategoryFilter("All");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResults([]);
    setError("");
    setResultLimit(10);
    setSearchedImage(null);
    setConfidenceFilter("All");
    setCategoryFilter("All");
  };

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(results.map(r => r.category)))];
  }, [results]);

  const filteredResults = results
    .filter(r => r.score >= threshold)
    .filter(r => confidenceFilter === "All" || getConfidence(r.score) === confidenceFilter)
    .filter(r => categoryFilter === "All" || r.category === categoryFilter);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Visual Product Matcher
          </h1>
          <p className="text-slate-600 text-lg">
            Upload an image or paste a URL to discover visually similar products.
          </p>
        </header>

        <ImageSearch onSearch={handleSearch} onClear={handleClear} loading={loading} />

        {error && <p className="text-red-600 text-center">{error}</p>}
        {loading && <p className="text-center text-slate-500">Searching…</p>}

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              {searchedImage && (
                <img
                  src={searchedImage}
                  className="w-14 h-14 rounded object-cover border"
                />
              )}

              <div>
                <p className="text-sm text-slate-500">Matches Found</p>
                <p className="font-semibold text-lg">
                  Showing {Math.min(resultLimit, filteredResults.length)} of {filteredResults.length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        {results.length > 0 && (
          <div className="bg-white border rounded-xl p-4 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">

            <select
              value={resultLimit}
              onChange={e => setResultLimit(Number(e.target.value))}
              className="border rounded-lg px-3 py-2"
            >
              <option value={5}>Show 5 results</option>
              <option value={10}>Show 10 results</option>
              <option value={20}>Show 20 results</option>
            </select>

            <select
              value={confidenceFilter}
              onChange={e => setConfidenceFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="All">All confidence levels</option>
              <option value="Very High">Very high confidence</option>
              <option value="High">High confidence</option>
              <option value="Moderate">Moderate confidence</option>
              <option value="Low">Low confidence</option>
            </select>

            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="All">All product categories</option>
              {categories.filter(c => c !== "All").map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <div>
              <label className="text-sm font-medium block mb-1">
                Minimum similarity ({(threshold * 100).toFixed(0)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-full"
              />
            </div>

          </div>
        )}

        {!loading && filteredResults.length === 0 && results.length > 0 && (
          <p className="text-center text-slate-500">
            No products match the current filters.
          </p>
        )}

        <ResultsGrid results={filteredResults.slice(0, resultLimit)} />

      </div>
    </main>
  );
}
