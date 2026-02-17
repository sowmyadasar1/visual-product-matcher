export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "@/lib/similarity";
import { embedImage } from "@/lib/serverEmbedding";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

/* Health check */
export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    let base64: string | null = null;

    /* ---------------- FILE UPLOAD ---------------- */

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      base64 = buffer.toString("base64");
    }

    /* ---------------- IMAGE URL ---------------- */

    if (!base64 && url) {
      const response = await fetch(url);
      const buffer = Buffer.from(await response.arrayBuffer());
      base64 = buffer.toString("base64");
    }

    if (!base64) {
      return NextResponse.json(
        { error: "Image file or URL required" },
        { status: 400 }
      );
    }

    const embedding = await embedImage(base64);

    const products = JSON.parse(
      fs.readFileSync(productsFilePath, "utf8")
    );

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
