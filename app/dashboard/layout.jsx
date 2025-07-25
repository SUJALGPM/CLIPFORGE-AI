"use client";
import React, { useState } from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { VideoDataContext } from "../_content/VideoDataContext";

function DashboardLayout({ children }) {
  const [videoData, setVideoData] = useState([]);

  return (
    <VideoDataContext.Provider value={{videoData,setVideoData}}>
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
  );
}

export default DashboardLayout;
