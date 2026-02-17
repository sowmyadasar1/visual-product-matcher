export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { cosineSimilarity } from "@/lib/similarity";
import { embedImage } from "@/lib/serverEmbedding";

const productsFilePath = path.join(process.cwd(), "data", "products.json");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    if (!file && !url) {
      return NextResponse.json({ error: "Image required" }, { status: 400 });
    }

    let base64: string;

    // FILE upload
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      base64 = Buffer.from(arrayBuffer).toString("base64");
    }

    // URL upload
    else {
      const res = await fetch(url!);
      if (!res.ok) throw new Error("Unable to fetch image URL");

      const buffer = await res.arrayBuffer();
      base64 = Buffer.from(buffer).toString("base64");
    }

    // Generate embedding
    const embedding = await embedImage(base64);

    // Load products
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf8"));

    console.log("Query embedding length:", embedding.length);
    console.log("Product embedding length:", products[0].embedding.length);

    const results = products
      .map((p: any) => ({
        ...p,
        score: cosineSimilarity(embedding, p.embedding),
      }))
      .sort((a: any, b: any) => b.score - a.score);

    return NextResponse.json(results);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
