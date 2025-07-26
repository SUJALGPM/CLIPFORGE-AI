"use client";
import React, { useEffect, useState } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_content/VideoDataContext";
import { UserDetailContext } from "../_content/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import { db } from "../../configs/db";
import { Users } from "../../configs/schema";
import { eq } from "drizzle-orm";

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);
  const [userDetail, setUserDetail] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getUserDetail();
  }, [user]);

  const getUserDetail = async () => {
    const result = await db
      .select()
      .from(Users)
      .where(eq(Users.email, user?.primaryEmailAddress?.emailAddress));

    if (result.length > 0) {
      setUserDetail(result[0]); 
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <VideoDataContext.Provider value={{ videoData, setVideoData }}>
        <div className="h-screen w-screen flex flex-col overflow-hidden">
          <div className="fixed top-0 left-0 right-0 z-50 h-[75px] bg-white shadow-sm">
            <Header />
          </div>

          <div className="flex pt-[65px] h-full overflow-hidden">
            <aside className="w-64 hidden md:block h-full overflow-y-auto">
              <SideNav />
            </aside>

            <main className="flex-1 bg-gray-50 p-10 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  );
}

export default DashboardLayout;
