"use client";

import { useState, useRef } from "react";

export default function ImageSearch({ onSearch, onClear, loading }: any) {
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFilePick = (e: any) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setUrl("");

    const previewUrl = URL.createObjectURL(selected);
    setPreview(previewUrl);
  };

  const handleSearch = () => {
    if (!file && !url) return;
    onSearch(file ?? undefined, preview ?? undefined, url);
  };

  const handleClear = () => {
    setPreview(null);
    setUrl("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    onClear();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">

      <input hidden type="file" ref={fileRef} onChange={handleFilePick} />

      <button
        onClick={() => fileRef.current?.click()}
        className="w-full border border-gray-300 rounded-lg py-2 font-medium hover:bg-gray-50"
      >
        Upload Image
      </button>

      <div className="text-center text-sm text-gray-400">or</div>

      <input
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setFile(null);
          setPreview(e.target.value || null);
        }}
        placeholder="Paste image URL"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
      />

      {preview && (
        <img
          src={preview}
          className="w-full max-h-64 object-contain rounded border"
        />
      )}

      <div className="flex gap-3 pt-2">
        <button
          disabled={loading}
          onClick={handleSearch}
          className="flex-1 bg-black text-white rounded-lg py-2 hover:bg-gray-800 disabled:opacity-50"
        >
          Search
        </button>

        <button
          onClick={handleClear}
          className="flex-1 border rounded-lg py-2 hover:bg-gray-50"
        >
          Clear
        </button>
      </div>

    </div>
  );
}
