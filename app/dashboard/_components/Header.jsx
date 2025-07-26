"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";
import Image from "next/image";
import React, { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserDetailContext } from "../../_content/UserDetailContext";

function Header() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  return (
    <div className="flex p-3 px-5 items-center justify-between shadow-md">
      <div className="flex gap-3 items-center">
        <Image src={"/logo.jpg"} height={50} width={50} alt="logo" />
        <h2 className="font-bold text-xl">AI Video Generator</h2>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-0">
          <Image src={"/coin.jpg"} height={35} width={35} alt="coin" />
          <h3 className="text-sm font-semibold">{userDetail?.credits ?? 0}</h3>
        </div>

        <Link href="/dashboard">
          <Button
            className={
              isDashboard
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          >
            Dashboard
          </Button>
        </Link>
        <UserButton />
      </div>
    </div>
  );
}

export default Header;
