"use client";

import { useState, useRef } from "react";

type ImageSearchProps = {
  imageUrl: string;
  setImageUrl: (value: string) => void;
  onSearch: (image: string) => void;
  onClear: () => void;
  loading: boolean;
};

export default function ImageSearch({
  imageUrl,
  setImageUrl,
  onSearch,
  onClear,
  loading,
}: ImageSearchProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setImageUrl(base64);
    };

    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    setImageUrl("");
    onClear();

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-8">
      <input
        type="text"
        placeholder="Paste image URL..."
        value={imageUrl.startsWith("data:") ? "" : imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border border-gray-300 text-gray-900 placeholder-gray-400 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-black"
      />

      <label className="block mb-4">
        <span className="block mb-2 text-sm font-medium text-gray-700">
          Upload Image
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
          className="block w-full text-sm text-gray-900
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-md file:border-0
                     file:text-sm file:font-medium
                     file:bg-black file:text-white
                     hover:file:bg-gray-800"
        />
      </label>

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="w-40 rounded-md border border-gray-200 shadow-sm"
          />
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => onSearch(imageUrl)}
          disabled={loading || !imageUrl}
          className="flex-1 bg-black text-white py-3 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={handleClear}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-100 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
