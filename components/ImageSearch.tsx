import { useState } from "react";

type ImageSearchProps = {
  imageUrl: string;
  setImageUrl: (value: string) => void;
  onSearch: (image: string) => void;
  loading: boolean;
};

export default function ImageSearch({
  imageUrl,
  setImageUrl,
  onSearch,
  loading,
}: ImageSearchProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
      onSearch(base64);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
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

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
        style={{ marginBottom: "10px" }}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: "150px", marginBottom: "10px" }}
        />
      )}

      <button
        onClick={() => onSearch(imageUrl)}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}
