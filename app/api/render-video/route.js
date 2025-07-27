import { renderMediaOnCloudRun } from "@remotion/cloudrun";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const { videoData } = body;

  try {
    const { url } = await renderMediaOnCloudRun({
      serveUrl: process.env.GCP_SERVE_URL, 
      composition: "RemotionVideo",
      codec: "h264",
      imageFormat: "jpeg",
      inputProps: videoData,
      privacy: "public",
      downloadBehavior: "download",
      region: "us-east1",
      timeoutInMilliseconds: 60000,
      functionName: process.env.REMOTION_CLOUDRUN_FUNCTION_NAME, 
    });

    return NextResponse.json({ success: true, url });
  } catch (err) {
    console.error("Render failed:", err);
    return NextResponse.json({ success: false, error: err.message });
  }
}
