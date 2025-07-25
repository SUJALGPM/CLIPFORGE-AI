import { NextResponse } from "next/server";
import generateVideoScript from "../../../configs/AiModel"; 

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    // console.log("Prompt received:", prompt);

    const result = await generateVideoScript(prompt);
    // console.log("Gemini result:", result);

    return NextResponse.json({ success: true, result });
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json({ success: false, error: e.message || "Something went wrong" }, { status: 500 });
  }
}
