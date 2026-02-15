import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";

const productsFilePath = path.join(
  process.cwd(),
  "data",
  "products.json"
);

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function generateEmbeddings() {
  console.log("Loading CLIP model...");
  
  const extractor = await pipeline(
  "image-feature-extraction",
  "Xenova/clip-vit-base-patch32"
  );


  console.log("Model loaded.");

  const fileData = fs.readFileSync(productsFilePath, "utf-8");
  const products = JSON.parse(fileData);

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    if (product.embedding) {
      console.log(`Skipping ${product.id}`);
      continue;
    }

    console.log(`Processing ${product.id}...`);

    try {
        const output = await extractor(product.image);

        // output is a Tensor
        const embedding = output.data;

        product.embedding = Array.from(embedding);


      console.log(`Embedding added for ${product.id}`);

      await sleep(200);

    } catch (error) {
      console.error(`Error processing ${product.id}:`, error);
    }
  }

  fs.writeFileSync(
    productsFilePath,
    JSON.stringify(products, null, 2)
  );

  console.log("All embeddings generated!");
}

generateEmbeddings();

