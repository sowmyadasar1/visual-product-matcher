import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "@/lib/similarity";
import { pipeline } from "@xenova/transformers";

const productsFilePath = path.join(
  process.cwd(),
  "data",
  "products.json"
);

let extractor: any;

async function getExtractor() {
  if (!extractor) {
    console.log("Loading CLIP model for API...");
    extractor = await pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32"
    );
  }
  return extractor;
}

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const extractor = await getExtractor();
    const output = await extractor(image);
    const queryEmbedding = Array.from(output.data as Float32Array) as number[];

    const fileData = fs.readFileSync(productsFilePath, "utf-8");
    const products = JSON.parse(fileData);

    const results = products.map((product: any) => {
      const score = cosineSimilarity(
        queryEmbedding,
        product.embedding
      );

      return { ...product, score };
    });

    results.sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json(results.slice(0, 10));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
