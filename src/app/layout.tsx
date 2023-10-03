import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import Link from 'next/link'
import '../globals.css';
import Head from 'next/head';
const Navigation = () => {

  return (
    <div className='flex flex-row w-full h-10 bg-[#060926]'>
      <Link href='/' className="text-3xl mb-6 font-semibold text-white pl-2 self-start">clubdenegocios</Link>
      <Link href={'/dashboard'} className='text-white self-center justify-center pl-6'> Dashboard </Link>
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
        <html lang="en" className='h-full w-full'>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* ... any other head elements you want to add */}
        </Head>
          <body className='h-full w-full'>
            <Navigation />
            {children}
          </body>
        </html>
      </ClerkProvider>
      
    )
  }