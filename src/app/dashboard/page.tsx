
import React from 'react';
import { UserEvents } from '../../components/UserEvents'
import RedirectsTable from '../../components/MuiTable';
import { PieChart } from '../../components/Pie'
import { BarChart } from '../../components/barChart';
import { LineChart } from '../../components/lineChart';
import LinkGenerator from '../../components/linkGenerator';
import { currentUser, SignIn, useOrganization } from "@clerk/nextjs";
import { getRedirectsById, getAllRedirects, getEventsByRedirectIDs } from '../../lib/database'
import { Suspense } from 'react';
import { Redirects } from 'k../../lib/database'
import Loading from './loading';
import { clerkClient } from '@clerk/nextjs';

const admin_ids = ['user_2VtTiEOsKed5P7Pp4Cz43XDaz9q', 'user_2WLjCFrFxmflLTNsYLcJoD54GxS', 'user_2WJPAx618kDIHX66pITbyuvfdz8','user_2X7TyZgrMpLej85vHQ5sgVyCjwh']

interface PlatformRedirectCounts {
    [key: string]: number;
}
const generateCounts = (redirectsArray: Redirects[]): PlatformRedirectCounts => {
    return redirectsArray.reduce((acc, curr) => {
        if (!acc[curr.platform]) {
            acc[curr.platform] = 0;
        }
        acc[curr.platform]++;
        return acc;
    }, {} as PlatformRedirectCounts);
}
export const getBestPerformingRedirects = (allRedirects: Redirects[]): { accountId: string, redirects: { platform: string, count: number }[] }[] => {
    // Group by account_id and platform
    const grouped: Record<string, Record<string, number>> = {};

    allRedirects.forEach(redirect => {
        if (!grouped[redirect.account_id]) {
            grouped[redirect.account_id] = {};
        }

        if (!grouped[redirect.account_id][redirect.platform]) {
            grouped[redirect.account_id][redirect.platform] = 0;
        }

        // Increment the count if there's a successful booking
        if (redirect.calendly_event_id !== null) {
            grouped[redirect.account_id][redirect.platform]++;
        }
    });

    // Convert the grouped object to an array, include account_id, and sort
    const sorted: { accountId: string, redirects: { platform: string, count: number }[] }[] = [];

    for (const accountId in grouped) {
        const redirects = Object.entries(grouped[accountId])
            .map(([platform, count]) => ({ platform, count }))
            .sort((a, b) => b.count - a.count); // Sort in descending order of count

        sorted.push({ accountId, redirects });
    }

    return sorted;
}



export default async function Page() {

    const user = await currentUser();
    if(!user){
        return (<div>Not logged in</div>)
    }

    const name = user.firstName
    const userId = user.id
    if(admin_ids.includes(userId)){
        let allRedirects = await getAllRedirects()
        allRedirects = allRedirects.filter(redirect => 
            typeof redirect.id !== 'undefined' && 
            typeof redirect.account_id === 'string' && 
            typeof redirect.platform === 'string' && 
            (redirect.redirect_timestamp instanceof Date || redirect.redirect_timestamp === null)
        )
        const eventIDs = allRedirects.map(redirect => redirect.calendly_event_id); // Get all event IDs
        let events = await getEventsByRedirectIDs(eventIDs); // Get all events by event IDs
        events = events.map((event, index) => { 
            console.log(event.event_data.payload.tracking.utm_source)
            return { 
                ...event
        
            }
        });

        console.log("Events: ", events)

        return (
            <div className="bg-[#16113A] p-2 sm:p-8 flex flex-col">
                 <h1 className='pb-8 pl-9 text-white'>Welcome, { name ? name : '' }!</h1>
            <div className='flex flex-col xl:flex-row w-full items-center'>
          
                    <div className='w-full flex flex-col sm:flex-row justify-between sm:max-h-[438px] xl:w-full '>
                        
                        <div className='w-full sm:w-1/2'>
                            <div className='bg-[#272953] p-6 rounded-lg h-[350px]'>
                                <h2 className="text-base mb-4 font-semibold text-white">Upcoming Events:</h2>
                                <div className="h-[calc(364px-6rem)] overflow-auto hide-scrollbar font-normal">
                                    <Suspense fallback={
                                        <Loading/>
                                    }>
                                        <UserEvents events={events}/>
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                        <div className='mb-3 sm:mb-0 sm:ml-3 w-full sm:w-1/2'>
                            <Suspense fallback={
                                <Loading/>
                            }>
                            <LinkGenerator id={userId}/>
                            </Suspense>
                        </div>
                    </div>
                        
               
                <div className='w-full xl:w-full p-2'>
                    <Suspense  fallback={
                       <Loading/>
                    }>
                        <BarChart redirects={allRedirects}/>
                    </Suspense>
                </div>
               
            </div>
           
            <section className="flex flex-wrap w-full mt-4">
                <div className='w-full sm:w-1/2 p-2'>
                    <div className='bg-[#272953] p-6 rounded-lg h-[275px]'>
                        <h2 className="text-xl mb-4 font-semibold text-white">Redirects</h2>
                        <div className="h-[calc(275px-6rem)] overflow-auto hide-scrollbar">
                            <Suspense fallback={
                               <Loading/>
                            }>
                                <RedirectsTable rows={allRedirects}/>
                            </Suspense>
                        </div>
                    </div>
                </div>
    
                <div className='w-full sm:w-1/2 p-2'>
                    <div className='h-full bg-[#272953] p-6 rounded-lg flex flex-col'>
                        <h2 className='text-white'>Link Clicks / Time</h2>
                        <div className='h-full'>
                        <Suspense fallback={
                               <Loading/>
                            }>
                            <LineChart redirects={allRedirects}/>
                            </Suspense>
                        </div>
                       
                    </div>
                </div>
            </section>
    
        </div>
        )
    } else {
        const userRedirects = await getRedirectsById(userId)
        let redirects = userRedirects.filter( (redirect) => redirect.account_id === userId) 
        redirects = redirects.filter(redirect => 
            typeof redirect.id !== 'undefined' && 
            typeof redirect.account_id === 'string' && 
            typeof redirect.platform === 'string' && 
            (redirect.redirect_timestamp instanceof Date || redirect.redirect_timestamp === null)
        );
        const counts = generateCounts(redirects);
        const scheduled = redirects.filter((event)=> event.calendly_event_id !== null)
        return (
            <div className="bg-[#16113A] p-2 sm:p-8 flex flex-col">
            <div className='flex flex-col xl:flex-row w-full items-center'>
                <div className='w-full p-2 '>
                    <div className='w-full flex flex-col sm:flex-row justify-between sm:max-h-[438px] xl:w-full '>
                    
                        <div className='w-full sm:w-1/2'>
                            <div className='bg-[#272953] p-6 rounded-lg h-[350px]'>
                                <h2 className="text-base mb-4 font-semibold text-white">Upcoming Events:</h2>
                                <div className="h-[calc(284px-6rem)] overflow-auto hide-scrollbar font-normal">
                                    <Suspense fallback={
                                        <Loading/>
                                    }>
                                        <UserEvents events={events}/>
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                        <div className='mb-3 sm:mb-0 sm:ml-3 w-full sm:w-1/2'>
                            <Suspense fallback={
                                <Loading/>
                            }>
                            <LinkGenerator id={userId}/>
                            </Suspense>
                        </div>
                    </div>
                        
                </div>
                <div className='w-full xl:w-full p-2'>
                    <Suspense  fallback={
                       <Loading/>
                    }>
                        <BarChart redirects={redirects}/>
                    </Suspense>
                </div>
               
            </div>
           
            <section className="flex flex-wrap w-full mt-4">
                <div className='w-full sm:w-1/2 p-2'>
                    <div className='bg-[#272953] p-6 rounded-lg h-[275px]'>
                        <h2 className="text-xl mb-4 font-semibold text-white">Redirects</h2>
                        <div className="h-[calc(275px-6rem)] overflow-auto hide-scrollbar">
                            <Suspense fallback={
                               <Loading/>
                            }>
                                <RedirectsTable rows={userRedirects}/>
                            </Suspense>
                        </div>
                    </div>
                </div>
    
                <div className='w-full sm:w-1/2 p-2'>
                    <div className='h-full bg-[#272953] p-6 rounded-lg flex flex-col'>
                        <h2 className='text-white'>Link Clicks / Time</h2>
                        <div className='h-full'>
                        <Suspense fallback={
                               <Loading/>
                            }>
                            <LineChart redirects={redirects}/>
                            </Suspense>
                        </div>
                       
                    </div>
                </div>
            </section>
    
        </div>
        )
    }

}
