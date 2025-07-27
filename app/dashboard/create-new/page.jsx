"use client";
import React, { useContext, useEffect, useState } from "react";
import SelectTopic from "./_components/SelectTopic";
import SelectStyle from "./_components/SelectStyle";
import SelectDuration from "./_components/SelectDuration";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import CustomLoading from "../_components/CustomLoading";
import { VideoDataContext } from "../../_content/VideoDataContext";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../configs/db";
import { Users, VideoData } from "../../../configs/schema";
import PlayerDialog from "../_components/PlayerDialog";
import { UserDetailContext } from "../../_content/UserDetailContext";
import { Toaster } from "../../../components/ui/sonner";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

function CreateNew() {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState();
  const [videoScript, setVideoScript] = useState([]);
  const [audioFileUrl, setAudioFileUrl] = useState();
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState([]);
  const { videoData, setVideoData } = useContext(VideoDataContext);
  const { user } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const [videoId, setVideoId] = useState();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  //Handle form inputs...
  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);

    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  //Handle create new button...
  const onCreateClickHandler = () => {
    // 1. Check if user has enough credits
    if (!userDetail || userDetail.credits <= 0) {
      toast.warning("Not enough credits to create a video!");
      return;
    }

    // 2. Validate required form fields
    const requiredFields = ["topic", "imageStyle", "duration"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (missingFields.length > 0) {
      toast.error(
        "Please fill in all required fields before creating a video."
      );
      return;
    }

    // 3. Proceed if everything is valid
    GetVideoScript();
  };

  // Get Video Script...
  const GetVideoScript = async () => {
    const prompt = `Write a script to generate ${formData.duration} video on topic: ${formData.topic} along with AI image prompt in ${formData.imageStyle} format for each scene and give me result in JSON format with imagePrompt and ContentText as field`;
    setLoading(true);

    try {
      const response = await axios.post("/api/get-video-script", {
        prompt: prompt,
      });

      let resultText = response.data.result;
      const parsed = JSON.parse(resultText);

      //Handle Audio script....
      setVideoScript(parsed.videoScript);
      GenerateAudioFile(parsed.videoScript);

      // Pass data to context..
      if (resultText) {
        setVideoData((prev) => ({
          ...prev,
          videoScript: parsed,
        }));
      }
    } catch (error) {
      console.error("Error fetching video script:", error);
    } finally {
      setLoading(false);
    }
  };

  //Check JSON data update or not?
  useEffect(() => {
    console.log("videoScript state updated:", videoScript);
  }, [videoScript]);

  // Handle audio generation...
  const GenerateAudioFile = async (data) => {
    setLoading(true);

    try {
      let script = "";
      const id = uuidv4();

      data.forEach((item) => {
        script += item.ContentText + " ";
      });

      const resp = await axios.post("/api/generate-audio", {
        text: script,
        id: id,
      });

      setAudioFileUrl(resp.data.audioUrl);
      const resultUrl = resp.data.audioUrl;

      // Check audio url and pass to generate captions...
      if (resultUrl) {
        GenerateAudioCaption(resultUrl, data);
      }

      setVideoData((prev) => ({
        ...prev,
        audioFileUrl: resultUrl,
      }));
    } catch (error) {
      console.error("Audio generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle caption generation...
  const GenerateAudioCaption = async (audioFileUrl, data) => {
    setLoading(true);

    try {
      const resp = await axios.post("/api/generate-caption", {
        audioFileUrl: audioFileUrl,
      });

      const resultArray = resp?.data?.result || [];
      setCaptions(resultArray);

      if (resultArray) {
        GenerateImages(data);
      }

      setVideoData((prev) => ({
        ...prev,
        captions: resultArray,
      }));
    } catch (error) {
      console.error("Caption generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Image generation...
  const GenerateImages = async (data) => {
    setLoading(true);

    try {
      const firstThreePrompts = data.slice(0, 2);
      const generatedImages = [];

      for (const item of firstThreePrompts) {
        const prompt = item?.imagePrompt;
        if (!prompt) continue;

        const response = await axios.post("/api/generate-image", {
          prompt,
        });

        const imageUrl = response.data?.imageUrl;
        if (imageUrl) {
          generatedImages.push(imageUrl);
        }
      }

      setImageList(generatedImages);

      setVideoData((prev) => ({
        ...prev,
        imageList: generatedImages,
      }));

      // console.log("Generated image list:", generatedImages);
    } catch (error) {
      console.error("Image generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check data is store in context...
  useEffect(() => {
    // console.log("Ongoing data :", videoData);
    const isReadyToSave =
      videoData?.videoScript &&
      videoData?.audioFileUrl &&
      videoData?.captions &&
      videoData?.imageList?.length > 0;

    if (isReadyToSave && !isSaved) {
      SaveVideoData();
      setIsSaved(true);
    }
  }, [videoData, isSaved]);

  // Handle save video data...
  const SaveVideoData = async () => {
    setLoading(true);
    try {
      const result = await db
        .insert(VideoData)
        .values({
          script: videoData?.videoScript,
          audioFileUrl: videoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList,
          createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
        })
        .returning({ id: VideoData?.id });

      setVideoId(result[0].id);
      setPlayVideo(true);
      setVideoData(null);
      await UpdateUserCredits();

      // console.log(" Data saved:", result);
    } catch (error) {
      console.error(" Error saving video data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle after videoCreation minus credits score...
  const UpdateUserCredits = async () => {
    const updatedCredits = userDetail?.credits - 10;

    // Update DB..
    await db
      .update(Users)
      .set({ credits: updatedCredits })
      .where(eq(Users.email, user?.primaryEmailAddress.emailAddress));

    // Update local context..
    setUserDetail((prev) => ({
      ...prev,
      credits: updatedCredits,
    }));
  };

  return (
    <div className="md:px-20">
      <h2 className="font-bold text-4xl text-purple-700 text-center">
        Create New
      </h2>

      <div className="mt-10 shadow-md p-10">
        {/* Select Topic */}
        <SelectTopic onUserSelect={onHandleInputChange} />

        {/* Select Style */}
        <SelectStyle onUserSelect={onHandleInputChange} />

        {/* Select Duration */}
        <SelectDuration onUserSelect={onHandleInputChange} />

        {/* Create Button */}
        <Button
          className="mt-10 w-full bg-purple-700"
          onClick={onCreateClickHandler}
          disabled={loading}
        >
          {loading ? "Generating..." : "Create Short"}
        </Button>

        <CustomLoading loading={loading} />
        <PlayerDialog
          playVideo={playVideo}
          videoId={videoId}
          setPlayVideo={setPlayVideo}
        />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default CreateNew;
