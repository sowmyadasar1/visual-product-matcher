import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

console.log("Token exists:", !!process.env.REPLICATE_API_TOKEN);

export async function embedWithReplicate(image: string) {
  const output = await replicate.run(
    "openai/clip-vit-base-patch32",
    {
      input: { image },
    }
  );

  return output as number[];
}
