export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "@/lib/similarity";
import { embedImage } from "@/lib/serverEmbedding";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

/* ---------------- GET (health check) ---------------- */

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

/* ---------------- POST ---------------- */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File required" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const embedding = await embedImage(base64);

    const products = JSON.parse(
      fs.readFileSync(productsFilePath, "utf8")
    );

    if (!products.length) {
      throw new Error("No products found");
    }

    console.log("Query embedding:", embedding.length);
    console.log("Product embedding:", products[0].embedding.length);

    const results = products
      .map((p: any) => ({
        ...p,
        score: cosineSimilarity(embedding, p.embedding),
      }))
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json(results);

  } catch (e: any) {
    console.error("MATCH API ERROR:", e);

    return NextResponse.json(
      {
        error: "Processing failed",
        details: e?.message || "Unknown",
      },
      { status: 500 }
    );
  }
}
