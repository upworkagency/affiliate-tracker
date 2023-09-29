import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import '../globals.css';

const Navigation = () => {

  return (
    <div className='flex flex-row w-full h-10 bg-[#232323]'>
      <h1 className="text-3xl mb-6 font-semibold text-white pl-2 self-start">clubdenegocios</h1>
      <h2 className='text-white self-center justify-center pl-12'> Dashboard </h2>
    </div>
  )
}

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <ClerkProvider>
        <html lang="en">
          <body>
            <Navigation />
            {children}
          </body>
        </html>
      </ClerkProvider>
      
    )
  }