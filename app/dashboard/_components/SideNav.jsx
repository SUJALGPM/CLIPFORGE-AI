"use client";

import {
  CircleUser,
  FileVideo,
  PanelsTopLeft,
  ShieldPlus,
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SideNav() {
  const pathname = usePathname(); 

  const MenuOption = [
    {
      id: 1,
      name: "Dashboard",
      path: "/dashboard",
      icon: PanelsTopLeft,
    },
    {
      id: 2,
      name: "Create New",
      path: "/dashboard/create-new",
      icon: FileVideo,
    },
    {
      id: 3,
      name: "Upgrade",
      path: "/upgrade",
      icon: ShieldPlus,
    },
    {
      id: 4,
      name: "Account",
      path: "/account",
      icon: CircleUser,
    },
  ];

  return (
    <div className="p-4 space-y-2">
      {MenuOption.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path; 

        return (
          <Link
            href={item.path}
            key={item.id}
            className={`flex items-center space-x-3 p-3 rounded-md transition 
              ${isActive ? "bg-purple-100 text-purple-700 font-semibold" : "hover:bg-gray-100 text-gray-700"}
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-purple-700" : "text-gray-600"}`} />
            <span className="text-sm">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default SideNav;
