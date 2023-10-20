import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import Link from 'next/link'
import '../globals.css';
import Head from 'next/head';
import { Montserrat, Raleway } from 'next/font/google'

const monserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ["700", "400"],
  variable: '--font-monserrat',
})
const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  weight: "700",
  variable: '--font-raleway',
}) 
export const size = {
  width: 32,
  height: 32,
}

const Navigation = () => {

  return (
    <div className='flex flex-row w-full h-10 bg-[#020304]'>
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
        <html lang="en" className={`h-full w-full ${monserrat.variable} ${raleway.variable}`}>
       
       
          <body className='h-full w-full'>
          <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* ... any other head elements you want to add */}
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap');
          </style>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@master/ci.min.css"
          />
          
        </Head>
            <Navigation />
            {children}
          </body>
        </html>
      </ClerkProvider>
      
    )
  }