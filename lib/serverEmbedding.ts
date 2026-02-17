import fs from "fs";
import path from "path";
import os from "os";
import { pipeline } from "@xenova/transformers";

let extractor: any = null;

async function getExtractor() {
  if (!extractor) {
    extractor = await pipeline(
      "image-feature-extraction",
      "Xenova/clip-vit-base-patch32"
    );
  }
  return extractor;
}

export async function embedImage(base64: string): Promise<number[]> {
  const model = await getExtractor();

  const tempPath = path.join(os.tmpdir(), `upload-${Date.now()}.png`);

  fs.writeFileSync(tempPath, Buffer.from(base64, "base64"));

  const output: any = await model(tempPath, {
    pooling: "mean",
    normalize: true,
  });

  fs.unlinkSync(tempPath);

  return Array.from(output.data);
}
