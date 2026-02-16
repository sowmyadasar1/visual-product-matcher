export async function embedWithReplicate(image: string) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "4d50797290df5c0e2b6f5f59d9cdd7b8b3dcfa3d9b2c1dcd6f6e8d4e5b3d2e4c",
      input: {
        image,
      },
    }),
  });

  const prediction = await response.json();
  if (!prediction.urls?.get) {
    throw new Error("Replicate start failed");
  }

  while (true) {
    const check = await fetch(prediction.urls.get, {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
    });
    const result = await check.json();

    if (result.status === "succeeded") return result.output;
    if (result.status === "failed") throw new Error("Embedding failed");
    await new Promise((r) => setTimeout(r, 1000));
  }
}
