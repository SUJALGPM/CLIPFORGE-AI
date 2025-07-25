// To run this code:
// 1. Install dependencies: npm install @google/genai mime
// 2. Create a .env file with: GEMINI_API_KEY=your_api_key_here
// 3. Run: node gemini-script.js

// import { GoogleGenAI } from "@google/genai";
// import dotenv from "dotenv";

// dotenv.config();

// const ai = new GoogleGenAI({
//   apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
// });

// const tools = [
//   {
//     googleSearch: {},
//   },
// ];

// const config = {
//   thinkingConfig: {
//     thinkingBudget: -1,
//   },
//   tools,
//   responseMimeType: "text/plain",
// };

// const model = "gemini-2.5-flash";

// export default async function generateVideoScript(userPrompt) {
//   const contents = [
//     {
//       role: "user",
//       parts: [
//         {
//           text: userPrompt,
//         },
//       ],
//     },
//   ];

//   try {
//     const response = await ai.models.generateContentStream({
//       model,
//       config,
//       contents,
//     });

//     let fullText = "";
//     for await (const chunk of response) {
//       fullText += chunk.text;
//     }

//     return fullText;
//   } catch (error) {
//     console.error("Gemini API error:", error.message || error);
//     throw error;
//   }
// }


import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const tools = [
  {
    googleSearch: {},
  },
];

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  tools,
  responseMimeType: "text/plain",
};

const model = "gemini-2.5-flash";

export default async function generateVideoScript(userPrompt) {
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: userPrompt,
        },
      ],
    },
  ];

  try {
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let fullText = "";
    for await (const chunk of response) {
      fullText += chunk.text;
    }

    const normalizedResult = normalizeScriptResponse(fullText);
    return JSON.stringify({ videoScript: normalizedResult });

  } catch (error) {
    console.error("Gemini API error:", error.message || error);
    throw error;
  }
}

function normalizeScriptResponse(rawText) {
  // Step 1: Extract JSON block if wrapped in ```json
  const cleanText = rawText.replace(/```json\s*([\s\S]*?)\s*```/, "$1").trim();

  let json;
  try {
    json = JSON.parse(cleanText);
  } catch (e) {
    // If not valid JSON, try to parse as array manually
    const fallbackParsed = fallbackExtractObjects(cleanText);
    return fallbackParsed;
  }

  if (Array.isArray(json)) {
    return json.map((item) => ({
      imagePrompt: item.imagePrompt || "",
      ContentText: item.ContentText || item.contentText || "",
    }));
  }

  if (Array.isArray(json.videoScript)) {
    return json.videoScript.map((item) => ({
      imagePrompt: item.imagePrompt || "",
      ContentText: item.ContentText || item.contentText || "",
    }));
  }

  return [];
}

function fallbackExtractObjects(text) {
  // Try to extract valid prompt/text pairs manually (not ideal but a backup)
  const lines = text.split("\n").filter((line) => line.includes("imagePrompt") || line.includes("ContentText") || line.includes("contentText"));

  const result = [];
  let current = {};
  for (let line of lines) {
    if (line.includes("imagePrompt")) {
      current.imagePrompt = line.split(":")[1]?.trim().replace(/^"|"$/g, "");
    }
    if (line.toLowerCase().includes("contenttext") || line.toLowerCase().includes("contentText")) {
      current.ContentText = line.split(":")[1]?.trim().replace(/^"|"$/g, "");
      result.push(current);
      current = {};
    }
  }

  return result;
}
