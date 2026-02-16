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

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // get embedding from Replicate
    const queryEmbedding = await embedWithReplicate(image);

    // load products and compare
    const fileData = fs.readFileSync(productsFilePath, "utf-8");
    const products = JSON.parse(fileData);

    const results = products
      .map((product: any) => ({
        ...product,
        score: cosineSimilarity(queryEmbedding, product.embedding),
      }))
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json(results.slice(0, 10));
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
