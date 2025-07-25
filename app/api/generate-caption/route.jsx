import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json();

    const client = new AssemblyAI({
      apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
    });

    const transcript = await client.transcripts.create({
      audio_url: audioFileUrl,
    });

    // console.log("Transcript:", transcript.words);

    return NextResponse.json({ result: transcript.words });
  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "Failed to transcribe audio." },
      { status: 500 }
    );
  }
}

