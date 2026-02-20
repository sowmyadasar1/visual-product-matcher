# Visual Product Matcher

A full-stack AI application that finds visually similar products from a catalog using image embeddings and cosine similarity.

Users can upload an image (or provide an image URL) and instantly receive ranked product matches with similarity scores, confidence levels, and filtering options.

This project demonstrates:

- Image embedding–based visual search
- Similarity ranking with cosine distance
- Modern Next.js App Router
- Server-side ML inference (Xenova + ONNX)
- Production deployment

---

## Approach

This project was designed as an end-to-end visual similarity search system using modern full-stack practices. The frontend is built with Next.js and React, providing a clean, responsive interface for image upload, URL input, and result filtering. When a user submits an image, it is converted to base64 and sent to a server-side API.

On the backend, a vision embedding model generates a numerical representation of the query image. Precomputed embeddings for all products are loaded from a local JSON dataset. Cosine similarity is then used to compare the query embedding with each product embedding, producing ranked matches based on visual closeness.

Results are returned to the frontend, where users can refine them using confidence levels, category filters, similarity thresholds, and result limits. The application is containerized with Docker to support native ONNX inference and deployed on Railway for production. This architecture demonstrates practical AI integration, efficient similarity search, and a user-focused interface suitable for real-world visual discovery systems.

---

## Features

- Upload image or paste image URL
- AI-powered visual similarity matching
- Similarity score + confidence labels
- Category filtering
- Minimum similarity slider
- Result limits (Top 5 / 10 / 20)
- Clean responsive UI
- Server-side inference
- Dockerized deployment

---

## How It Works

1. User uploads an image (or provides a URL)
2. Image is converted to base64
3. A vision embedding model generates a vector representation
4. Product embeddings are loaded from `products.json`
5. Cosine similarity is computed between query and catalog embeddings
6. Results are ranked and returned to the frontend
7. UI displays matches with filters and scores

---

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Xenova Transformers
- ONNX Runtime
- Node.js
- Docker
- Railway (deployment)

---

## Project Structure

```
app/
├ api/match/route.ts # Image matching API
├ page.tsx # Main UI

components/
├ ImageSearch.tsx
├ ResultsGrid.tsx

lib/
├ serverEmbedding.ts
├ similarity.ts

data/
├ products.json

Dockerfile
```


---

## Local Development

### 1. Install dependencies

```
npm install
```

### 2. Run dev server
```
npm run dev
```


---

## 🐳 Docker Build
```
docker build -t visual-product-matcher .
docker run -p 3000:3000 visual-product-matcher
```


---

## Production Deployment

This project is deployed using Docker on Railway to support native ONNX runtime.

Steps:

1. Push project to GitHub

2. Add Dockerfile (already included)

3. Create Railway project from GitHub repo

4. Railway automatically builds + deploys

5. Open generated 


---

## API Endpoint
POST /api/match

Accepts:

- Multipart file upload (file)

- OR image URL (url)

Returns:
```
[
  {
    "id": "1",
    "name": "Product Name",
    "image": "/image.jpg",
    "category": "Shoes",
    "score": 0.82
  }
]
```


---

## Similarity Scoring

Confidence levels:

- Very High: > 0.85

- High: > 0.75

- Moderate: > 0.60

- Low: ≤ 0.60


---

## Error Handling

- Prevents empty requests

- Supports file OR URL

- Server always returns JSON

- Graceful frontend error messages
