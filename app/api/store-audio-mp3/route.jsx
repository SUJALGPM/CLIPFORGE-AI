// pages/api/upload-audio.js
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Create Supabase client inline
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Upload handler
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { fileName } = req.body; 

    // Assuming the audio file is saved in /public/temp
    const filePath = path.join(process.cwd(), "public", "temp", fileName);
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage
      .from("amazon") 
      .upload(fileName, fileBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (error) {
      console.error("Upload failed:", error);
      return res.status(500).json({ error: error.message });
    }

    const { data: publicUrl } = supabase.storage
      .from("amazon")
      .getPublicUrl(fileName);

    return res.status(200).json({ publicUrl: publicUrl.publicUrl });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
