import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

function RemotionVideo({ script, imageList, audioFileUrl, captions }) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  // fetch duration of video...
  const totalDuration = (captions?.[captions.length - 1]?.end / 1000) * fps || 1;
  const segmentDuration = totalDuration / (imageList?.length || 1);

  // handle captions of video...
  const getCurrentCaptions = () => {
    const currentTime = (frame / fps) * 1000;
    const currentCaption = captions?.find(
      (word) => currentTime >= word.start && currentTime <= word.end
    );
    return currentCaption ? currentCaption.text : "";
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {imageList?.map((item, index) => {
        // handle start and end frame for render...
        const startFrame = Math.round(index * segmentDuration);
        const endFrame = startFrame + Math.round(segmentDuration);
        const localFrame = frame - startFrame;

        // Speed up zoom to happen in first 40%...
        const zoomDuration = segmentDuration * 0.4;

        // handle zoopm in effect..
        const scale = interpolate(
          localFrame,
          [0, segmentDuration * 0.2, segmentDuration * 0.6, segmentDuration],
          [1, 1.1, 1, 1],
          { extrapolateRight: "clamp" }
        );
        const translateX = interpolate(
          localFrame,
          [0, segmentDuration * 0.2, segmentDuration * 0.6, segmentDuration],
          [0, -20, 0, 0],
          { extrapolateRight: "clamp" }
        );

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={Math.round(segmentDuration)}
          >
            <AbsoluteFill
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Img
                  src={item}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale}) translateX(${translateX}px)`,
                  }}
                />
              </div>

              <AbsoluteFill
                style={{
                  color: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  top: "56%",
                  bottom: 50,
                  height: 150,
                  textAlign: "center",
                  width: "100%",
                  display: "flex",
                }}
              >
                <h2 className="text-2xl">{getCurrentCaptions()}</h2>
              </AbsoluteFill>
            </AbsoluteFill>
          </Sequence>
        );
      })}
      <Audio src={audioFileUrl} />
    </AbsoluteFill>
  );
}

export default RemotionVideo;
