"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Player } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import { Ghost } from "lucide-react";
import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import axios from "axios";
import CustomLoading from "../_components/CustomLoading";

function PlayerDialog({ playVideo, setPlayVideo, videoId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(30);
  const [loading, setLoading] = useState();
  const router = useRouter();
  const fps = 30;

  // handle dialog trigger with getvideodata...
  useEffect(() => {
    if (playVideo && videoId) {
      setOpenDialog(true);
      GetVideoData();
      setPlayVideo(false);
    }
  }, [playVideo, videoId]);

  // Fetch video data for render...
  const GetVideoData = async () => {
    try {
      const result = await db
        .select()
        .from(VideoData)
        .where(eq(VideoData.id, videoId));

      const data = result[0];

      if (typeof data.imageList === "string") {
        data.imageList = JSON.parse(data.imageList);
      }

      setVideoData(data);

      const lastCaptionEnd =
        data?.captions?.[data.captions.length - 1]?.end || 1000;
      const duration = (lastCaptionEnd / 1000) * fps;
      setDurationInFrames(Math.round(duration));
    } catch (err) {
      console.error("Failed to fetch video data:", err);
    }
  };

  // handle repeat trigger of dialog...
  const handleCancel = () => {
    setOpenDialog(false);
    setPlayVideo(false);
    router.replace("/dashboard");
  };

  // handle export to render with Google_cloud_service...
  // const handleExport = async () => {
  //   try {
  //     // const res = await fetch("/api/render-video", {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify({ videoData }),
  //     // });

  //     // const result = await res.json();

  //     // if (result.success && result.url) {
  //     //   const a = document.createElement("a");
  //     //   a.href = result.url;
  //     //   a.download = "video.mp4";
  //     //   document.body.appendChild(a);
  //     //   a.click();
  //     //   a.remove();
  //     // } else {
  //     //   alert("Export failed: " + result.error);
  //     // }

  //     console.log("video rendering is still in production..!!");

  //   } catch (err) {
  //     console.error("Export error:", err);
  //     alert("Something went wrong!");
  //   }
  // };

  // handle export to render with ShotStack API...
  const handleExport = async () => {
    setLoading(true);
    try {
      const API_KEY = process.env.NEXT_PUBLIC_SHOTSTACK_API_KEY;
      const ENDPOINT = "https://api.shotstack.io/stage/render";

      const videoDurationPerImage = 3;
      const soundtrack = videoData?.audioFileUrl || "";
      const images = videoData?.imageList || [];
      const captions = videoData?.captions || [];

      // Get total audio or caption duration
      const audioDuration = videoData?.audioDuration || 30; // fallback to 30s
      const captionEnd = Math.max(...captions.map((c) => c.end || 0)) / 1000;
      const fullDuration = Math.max(audioDuration, captionEnd);

      // Build image clips
      let imageClips = images.map((img, index) => ({
        asset: {
          type: "image",
          src: img,
        },
        start: index * videoDurationPerImage,
        length: videoDurationPerImage,
      }));

      // Extend last image if needed
      const totalImageDuration = imageClips.length * videoDurationPerImage;
      if (totalImageDuration < fullDuration && imageClips.length > 0) {
        const extraDuration = fullDuration - totalImageDuration;
        imageClips[imageClips.length - 1].length += extraDuration;
      }

      const captionClips = captions.map((caption) => ({
        asset: {
          type: "title",
          text: caption.text,
          style: "minimal",
        },
        start: caption.start / 1000,
        length: (caption.end - caption.start) / 1000,
      }));

      const payload = {
        timeline: {
          soundtrack: soundtrack
            ? {
                src: soundtrack,
                effect: "fadeInFadeOut",
              }
            : null,
          tracks: [{ clips: imageClips }, { clips: captionClips }],
        },
        output: {
          format: "mp4",
          resolution: "sd",
        },
      };

      // Send render request
      const renderRes = await axios.post(ENDPOINT, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      const renderId = renderRes.data.response.id;

      // Poll render status
      let status = "queued";
      let videoUrl = "";

      while (status !== "done" && status !== "failed") {
        await new Promise((res) => setTimeout(res, 3000));
        const pollRes = await axios.get(
          `https://api.shotstack.io/stage/render/${renderId}`,
          {
            headers: { "x-api-key": API_KEY },
          }
        );
        status = pollRes.data.response.status;
        videoUrl = pollRes.data.response.url;
      }

      // Download the final video
      if (status === "done" && videoUrl) {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "generated_video.mp4";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert("Render failed.");
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Something went wrong during export.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <Dialog open={openDialog}>
        <DialogContent className="bg-white flex flex-col items-center">

          <DialogHeader>
            <DialogTitle className="text-3xl font-bold my-5">
              Your video is ready
            </DialogTitle>
            <DialogDescription>
              {videoData?.imageList?.length > 0 && (
                <span className="sr-only">Video preview below</span>
              )}
            </DialogDescription>
          </DialogHeader>

          {videoData?.imageList?.length > 0 && (
            <Player
              component={RemotionVideo}
              durationInFrames={durationInFrames}
              compositionWidth={300}
              compositionHeight={450}
              fps={fps}
              controls={true}
              inputProps={videoData}
            />
          )}

          <div className="flex gap-10 mt-5 justify-center">
            <Button
              variant={Ghost}
              onClick={handleCancel}
              className="cursor-pointer hover:text-red-600 hover:bg-red-100 transition-colors duration-200"
            >
              Cancel
            </Button>
            <Button onClick={handleExport}>{loading ? "Exporting..." : "Export"}</Button>
          </div>
        </DialogContent>
      </Dialog> */}

      <Dialog open={openDialog}>
        <DialogContent className="bg-white flex flex-col items-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <img
                src="/progress.gif"
                alt="Loading..."
                className="w-24 h-24 mb-4"
              />
              <p className="text-lg font-medium">
                Exporting video... Please wait
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold my-5">
                  Your video is ready
                </DialogTitle>
                <DialogDescription>
                  {videoData?.imageList?.length > 0 && (
                    <span className="sr-only">Video preview below</span>
                  )}
                </DialogDescription>
              </DialogHeader>

              {videoData?.imageList?.length > 0 && (
                <Player
                  component={RemotionVideo}
                  durationInFrames={durationInFrames}
                  compositionWidth={300}
                  compositionHeight={450}
                  fps={fps}
                  controls={true}
                  inputProps={videoData}
                />
              )}

              <div className="flex gap-10 mt-5 justify-center">
                <Button
                  variant={Ghost}
                  onClick={handleCancel}
                  className="cursor-pointer hover:text-red-600 hover:bg-red-100 transition-colors duration-200"
                >
                  Cancel
                </Button>
                <Button onClick={handleExport}>
                  {loading ? "Exporting..." : "Export"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PlayerDialog;
