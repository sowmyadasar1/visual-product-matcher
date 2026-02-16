export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "@/lib/similarity";

const productsFilePath = path.join(
  process.cwd(),
  "data",
  "products.json"
);

export async function POST(req: Request) {
  try {
    const { embedding } = await req.json();

    if (!embedding) {
      return NextResponse.json(
        { error: "Embedding required" },
        { status: 400 }
      );
    }

    const fileData = fs.readFileSync(productsFilePath, "utf-8");
    const products = JSON.parse(fileData);

    const results = products
      .map((product: any) => ({
        ...product,
        score: cosineSimilarity(embedding, product.embedding),
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
