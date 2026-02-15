export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline } from "@xenova/transformers";
import { cosineSimilarity } from "@/lib/similarity";

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
  let tempFilePath: string | null = null;

  try {
    const { image } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const model = await getExtractor();
    let inputImage: string = image;

    // Handle base64 upload
    if (image.startsWith("data:image")) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      tempFilePath = path.join(
        process.cwd(),
        `temp-upload-${Date.now()}.png`
      );

      fs.writeFileSync(tempFilePath, buffer);
      inputImage = tempFilePath;
    }

    const output = await model(inputImage);

    const queryEmbedding = Array.from(
      output.data as Float32Array
    ) as number[];

    const fileData = fs.readFileSync(productsFilePath, "utf-8");
    const products = JSON.parse(fileData);

    const results = products
      .map((product: any) => {
        const score = cosineSimilarity(
          queryEmbedding,
          product.embedding
        );

        return { ...product, score };
      })
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Match API error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  } finally {
    // Clean up temp file safely
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
}
