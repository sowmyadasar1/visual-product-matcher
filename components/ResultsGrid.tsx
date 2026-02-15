type ProductMatch = {
  id: string;
  name: string;
  image: string;
  category: string;
  score: number;
};

type ResultsGridProps = {
  results: ProductMatch[];
};

export default function ResultsGrid({ results }: ResultsGridProps) {
  return (
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
  );
}
