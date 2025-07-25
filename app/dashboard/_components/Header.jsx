"use client";

import { UserButton } from '@clerk/nextjs';
import { Button } from '../../../components/ui/button';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

function Header() {
  const pathname = usePathname(); 
  const isDashboard = pathname === '/dashboard';

  return (
    <div className="flex p-3 px-5 items-center justify-between shadow-md">
      <div className='flex gap-3 items-center'>
        <Image src={'/logo.jpg'} height={50} width={50} alt='logo' />
        <h2 className='font-bold text-xl'>AI Video Generator</h2>
      </div>

      <div className='flex gap-3 items-center'>
        <Link href="/dashboard">
          <Button
            className={isDashboard
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
