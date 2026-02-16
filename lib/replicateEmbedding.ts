export async function embedWithReplicate(image: string) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "c2c9b29bdfb66d8a9a0e8d8f12d643a4b9d0b9d5d8a9b8c7e6f5d4c3b2a1e0f", 
      input: {
        image: image,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Replicate API error: ${err}`);
  }

  const prediction = await response.json();

  if (!prediction.urls?.get) {
    throw new Error("Invalid Replicate response");
  }

  // Poll until finished
  while (true) {
    const check = await fetch(prediction.urls.get, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });

    const result = await check.json();

    if (result.status === "succeeded") {
      return result.output;
    }

    if (result.status === "failed") {
      throw new Error("Embedding failed");
    }

    await new Promise((r) => setTimeout(r, 1000));
  }
}
