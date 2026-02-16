export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "@/lib/similarity";
import { embedWithReplicate } from "@/lib/replicateEmbedding";

const productsFilePath = path.join(
  process.cwd(),
  "data",
  "products.json"
);

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image required" },
        { status: 400 }
      );
    }

    // 🔥 Get CLIP embedding from Replicate
    const queryEmbedding = await embedWithReplicate(image);

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length !== 512) {
      throw new Error("Invalid embedding returned from Replicate");
    }

    const fileData = fs.readFileSync(productsFilePath, "utf-8");
    const products = JSON.parse(fileData);

    const results = products
      .map((product: any) => ({
        ...product,
        score: cosineSimilarity(queryEmbedding, product.embedding),
      }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
