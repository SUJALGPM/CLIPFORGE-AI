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

function PlayerDialog({ playVideo, setPlayVideo, videoId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [durationInFrames, setDurationInFrames] = useState(30);
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

      const lastCaptionEnd = data?.captions?.[data.captions.length - 1]?.end || 1000;
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

  return (
    <Dialog open={openDialog}>
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
          <Button>Export</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog;
