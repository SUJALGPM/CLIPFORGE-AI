'use client'; // Ensures this runs on the client side

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '../configs/db';
import { Users } from '../configs/schema';
import { eq } from 'drizzle-orm';

function Provider({children}) {
  
  const {user}=useUser();
  
  useEffect(()=>{
    user&&isNewUser();
  },[user])

  const isNewUser = async()=>{
    const result = await db.select().from(Users)
    .where(eq(Users.email,user?.primaryEmailAddress?.emailAddress));

    if(!result[0]){
      await db.insert(Users).values({
        name:user.fullName,
        email:user?.primaryEmailAddress?.emailAddress,
        imageUrl:user?.imageUrl
      })
    }
  }

  return (
    <div>
        {children}
    </div>
  )
}

export default Provider;