"use client";

import { useState, useMemo } from "react";
import { pipeline } from "@xenova/transformers";
import ImageSearch from "@/components/ImageSearch";
import ResultsGrid from "@/components/ResultsGrid";

type ProductMatch = {
  id: string;
  name: string;
  image: string;
  category: string;
  score: number;
};

let extractor: any;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32"
    );
  }
  return extractor;
}


export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [results, setResults] = useState<ProductMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultLimit, setResultLimit] = useState(10);
  const [searchedImage, setSearchedImage] = useState<string | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const getConfidence = (score: number) => {
    if (score > 0.85) return "Very High";
    if (score > 0.75) return "High";
    if (score > 0.6) return "Moderate";
    return "Low";
  };

  const handleSearch = async (image: string) => {
  if (!image) return;

  setLoading(true);
  setError("");
  setResults([]);

  try {
    const model = await getExtractor();

    let output;

    if (image.startsWith("data:")) {
      // File upload (base64)
      output = await model(image);
    } else {
      // Image URL
      output = await model(image);
    }

    const embedding = Array.from(output.data);

    const res = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embedding }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch matches");
    }

    const data = await res.json();
    setResults(data);
    setSearchedImage(image);
    setConfidenceFilter("All");
    setCategoryFilter("All");
  } catch (err) {
    console.error(err);
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
    setSearchedImage(null);
    setConfidenceFilter("All");
    setCategoryFilter("All");
  };

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(results.map(r => r.category)))];
  }, [results]);

  const filteredResults = results
    .filter((product) => {
      if (confidenceFilter === "All") return true;
      return getConfidence(product.score) === confidenceFilter;
    })
    .filter((product) => {
      if (categoryFilter === "All") return true;
      return product.category === categoryFilter;
    });

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

        {results.length > 0 && searchedImage && (
          <div className="mb-8 flex items-center gap-4">
            <img
              src={searchedImage}
              alt="Search query"
              className="w-20 h-20 object-cover rounded-md border border-gray-200"
            />
            <div>
              <p className="text-sm text-gray-500">Search results</p>
              <p className="text-gray-900 font-medium">
                Showing {Math.min(resultLimit, filteredResults.length)} similar products
              </p>

            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
            <p className="text-sm text-gray-600">
              Displaying {Math.min(resultLimit, filteredResults.length)} of {filteredResults.length}
            </p>

            <div className="flex gap-3 flex-wrap">
              <select
                value={resultLimit}
                onChange={(e) => setResultLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
              </select>

              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="All">All Confidence</option>
                <option value="Very High">Very High</option>
                <option value="High">High</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <ResultsGrid results={filteredResults.slice(0, resultLimit)} />
      </div>
    </main>
  );
}
