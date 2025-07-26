"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import EmptyState from "./_components/EmptyState";
import { db } from "../../configs/db";
import { VideoData } from "../../configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import VideoList from "./_components/VideoList";

function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  const {user} = useUser();


  // Check user data fro videolist...
  useEffect(()=>{
    user&&GetVideoList();
  },[user]);

  // Handle video list...
  const GetVideoList=async()=>{
    const result = await db.select().from(VideoData).where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress));
    console.log("result ala :",result);
    setVideoList(result);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-purple-700">Dashboard</h2>
        <Link href={"/dashboard/create-new"}>
          <Button className="bg-purple-700">+ Create New</Button>
        </Link>
      </div>

      {/* Empty State */}
      {videoList?.length === 0 && (
        <div>
          <EmptyState />
        </div>
      )}

      {/* List of Videos */}
      <VideoList videoList={videoList}/>

    </div>
  );
}

export default Dashboard;
