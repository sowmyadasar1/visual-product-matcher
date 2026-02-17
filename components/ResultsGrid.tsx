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
  if (!results.length) return null;

  const getConfidence = (score: number) => {
    if (score > 0.85) return "Very High";
    if (score > 0.75) return "High";
    if (score > 0.6) return "Moderate";
    return "Low";
  };

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((product) => (
        <div
          key={product.id}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-3"
          />

          <h3 className="font-semibold text-lg text-gray-900">
            {product.name}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {product.category}
          </p>

          <div className="mt-3 space-y-1">
            <p className="text-sm text-gray-600">
              Confidence:{" "}
              <span className="font-medium text-gray-900">
                {getConfidence(product.score)}
              </span>
            </p>

            <p className="text-sm text-gray-600">
              Similarity:{" "}
              <span className="font-medium text-gray-900">
                {(product.score * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
