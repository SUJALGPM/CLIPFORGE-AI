import React, { useState } from "react";
import { Thumbnail } from "@remotion/player";
import RemotionVideo from "./RemotionVideo";
import PlayerDialog from "./PlayerDialog";

function VideoList({ videoList }) {
  const [openPlayerDialog, setOpenPlayerDialog] = useState(false);
  const [videoId, setVideoId] = useState(1);

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videoList?.map((video, index) => (
        <div
          key={video.id || index}
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => {
            setOpenPlayerDialog(true);
            setVideoId(video?.id);
          }}
        >
          <Thumbnail
            component={RemotionVideo}
            compositionWidth={260}
            compositionHeight={400}
            frameToDisplay={30}
            durationInFrames={120}
            fps={30}
            style={{
              borderRadius: 15,
            }}
            inputProps={{
              ...video,
              frame: 30,
            }}
          />
        </div>
      ))}

      {/* Add setPlayVideo prop */}
      <PlayerDialog
        playVideo={openPlayerDialog}
        setPlayVideo={setOpenPlayerDialog}
        videoId={videoId}
      />
    </div>
  );
}

export default VideoList;
