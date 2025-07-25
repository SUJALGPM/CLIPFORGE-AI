// 1. Code which have only use to generate TTS..

// import textToSpeech from "@google-cloud/text-to-speech";
// import { NextResponse } from "next/server";
// const fs = require("fs");
// const util = require("util");

// // Handle Google cloud API...
// const client = new textToSpeech.TextToSpeechClient({
//   apiKey: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY,
// });

// export async function POST(req) {
//   const { text, id } = await req.json();

//   // Construct the request
//   const request = {
//     input: { text: text },
//     // Select the language and SSML voice gender (optional)
//     voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
//     // select the type of audio encoding
//     audioConfig: { audioEncoding: "MP3" },
//   };

//   // Performs the text-to-speech request
//   const [response] = await client.synthesizeSpeech(request);

//   // Write the binary audio content to a local file
//   const writeFile = util.promisify(fs.writeFile);
//   await writeFile("output.mp3", response.audioContent, "binary");
//   console.log("Audio content written to file: output.mp3");

//   return NextResponse.json({ Results: "Sucess" });
// }


// 2. Code with use to generate and store audio mp3 and get URL.
import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import util from "util";

// Supabase Setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Google TTS Client
const client = new textToSpeech.TextToSpeechClient({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_CLOUD_API_KEY,
});

export async function POST(req) {
  const { text, id } = await req.json();
  const fileName = `audio-${id}.mp3`;
  const tempDir = path.join(process.cwd(), "public", "temp");
  const filePath = path.join(tempDir, fileName);

  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log("Created directory:", tempDir);
    }

    // 1. TTS Request
    const request = {
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    };

    const [response] = await client.synthesizeSpeech(request);

    // 2. Save the audio to file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(filePath, response.audioContent, "binary");

    // 3. Read file buffer
    const fileBuffer = fs.readFileSync(filePath);

    // 4. Upload to Supabase
    const { data, error } = await supabase.storage
      .from("amazon")
      .upload(fileName, fileBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload failed:", error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // 5. Get Public URL
    const { data: publicUrl } = supabase.storage
      .from("amazon")
      .getPublicUrl(fileName);

    // 6. Return the public URL
    return NextResponse.json({ audioUrl: publicUrl.publicUrl });

  } catch (err) {
    console.error("Error in TTS route:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
