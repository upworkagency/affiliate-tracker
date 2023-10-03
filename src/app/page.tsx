import React from 'react'
import LinkGenerator from '../components/linkGenerator';
import { currentUser } from '@clerk/nextjs';
export default async function Page() {
    const user = await currentUser();
    if(!user) return (
    <div className='w-full h-full flex flex-row align-middle items-center'>
        <h1>Not logged in</h1> 
    </div>
    )
    return (
        <div style={{ height: 'calc(100% - 45px)' }} className='w-full flex items-center justify-center bg-[#16113A]'>
            <div className='p-6'>
                <LinkGenerator id={user.id}/>
            </div>
        </div>
    )
}