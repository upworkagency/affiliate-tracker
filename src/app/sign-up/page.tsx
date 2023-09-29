"use client"
import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return (<div className='w-full h-full flex flex-row align-middle items-center'>
    <SignUp />
  </div>);
}