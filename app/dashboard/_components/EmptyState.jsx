import Link from 'next/link';
import { Button } from '../../../components/ui/button';
import React from 'react'

function EmptyState() {
  return (
    <div className='p-5 py-24 mt-10 border-3 border-dashed flex flex-col items-center justify-center text-center'>
      <h2 className="text-lg font-semibold mb-4">You don't have any short video created</h2>
      <Link href={'/dashboard/create-new'}>
        <Button className="bg-purple-700">Create New Short Video</Button>
      </Link>
    </div>
  )
}

export default EmptyState;
