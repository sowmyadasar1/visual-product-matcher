### Visual Product Matcher

A web application that allows users to upload an image and find visually similar products using image embeddings and cosine similarity.

Live Demo: [https://visual-product-matcher-iota.vercel.app/](https://visual-product-matcher-iota.vercel.app/)

Repository: [https://github.com/sowmyadasar1/visual-product-matcher](https://github.com/sowmyadasar1/visual-product-matcher)


## Overview

This project implements a visual similarity search system. Users can upload an image (file or URL), and the system returns visually similar products ranked by similarity score.

The application uses image embeddings to compare products and calculates similarity using cosine similarity. Results can be filtered by confidence level, category, and number of results displayed.

The UI is responsive, includes loading states, and provides basic error handling for a smooth user experience.


## Features

- Image upload (file input)

- Image URL input

- Image preview before search

- 55-product dataset with metadata

- Cosine similarity matching

- Confidence labeling (Very High, High, Moderate, Low)

- Category filtering

- Top 5 / Top 10 result selection

- Responsive design (mobile-friendly)

- Loading states and error handling


## Tech Stack

- Next.js (App Router)

- React

- TypeScript

- Tailwind CSS

- OpenAI CLIP (for image embeddings)

- Cosine similarity for ranking


## How It Works

1. A user uploads an image or provides an image URL.

2. The backend generates an embedding for the query image using a pre-trained model.

3. The query embedding is compared against precomputed product embeddings.

4. Cosine similarity is calculated between vectors.

5. Products are ranked by similarity score.

6. The frontend allows filtering by confidence level, category, and result count.

- Confidence levels are derived from similarity thresholds:

    - 0.85 → Very High

    - 0.75 → High

    - 0.60 → Moderate

    - ≤ 0.60 → Low


## Project Structure

```
app/
  api/match/route.ts
  page.tsx
components/
  ImageSearch.tsx
  ResultsGrid.tsx
data/
  products.json
lib/
  similarity.ts
scripts/
  generateEmbeddings.ts
```


## Running Locally

1. Clone the repository:
```
git clone https://github.com/sowmyadasar1/visual-product-matcher.git
```

2. Install dependencies:
```
npm install
```

3. Create a .env.local file and add required API keys.

4. Run the development server:
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)