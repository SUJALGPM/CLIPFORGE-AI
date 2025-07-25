import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // If you're using Node v18+, fetch is already available.

const AIML_API_KEY = "c94516dd5a934506a3b2e9f376b43e3c"; // test key

async function generateImage(prompt) {
  try {
    const aimlResponse = await fetch("https://api.aimlapi.com/v1/images/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AIML_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "1024x1024",
      }),
    });

    if (!aimlResponse.ok) {
      const errorData = await aimlResponse.json();
      console.error("AIML API Error:", errorData);
      return;
    }

    const result = await aimlResponse.json();
    const imageUrl = result.data[0]?.url;

    if (!imageUrl) {
      console.error("No image URL returned.");
      return;
    }

    console.log("Generated image URL:", imageUrl);

    const imageFetch = await fetch(imageUrl);
    const arrayBuffer = await imageFetch.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const dir = path.join(process.cwd(), "generated");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filename = `aiml-${Date.now()}.png`;
    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);

    console.log(`✅ Image saved to: ${filepath}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// Run with your own prompt
const prompt = "A futuristic city skyline at night with flying cars";
generateImage(prompt);
