import React from 'react'
import { Redirects } from 'kysely-codegen/dist/db'
import { getEventsByRedirectIDs } from '../lib/database'

interface UserEventProps {
    redirects: Redirects[]
}

export const UserEvents: React.FC<UserEventProps> = async ({ redirects }) => {
    const currentDate = new Date();  // Get the current date and time

    const eventIDs = redirects.map(redirect => redirect.calendly_event_id); // Get all event IDs

    if(!eventIDs){
        return (
            <div className='w-full shadow-md rounded-md p-6 bg-white h-[275px]'>
                <h2 className="text-xl font-semibold text-gray-700"> Upcoming Events: </h2>
                <div className="h-40 flex flex-col align-middle justify-center text-center text-sm text-gray-600">No Events</div>
            </div>
        )
    }
    let upcomingEvents = await getEventsByRedirectIDs(eventIDs); // Get all events by event IDs

    upcomingEvents = upcomingEvents
        .filter(redirect => new Date(redirect.start_time.toString()) > currentDate); // Filter out past events

        return (
            <div className='w-full shadow-md rounded-md p-6 bg-white h-[275px] overflow-auto'>
                <h2 className="text-xl font-semibold text-gray-700"> Upcoming Events: </h2>
                {
                    upcomingEvents.length > 0 ? 
                    upcomingEvents.map((event) => {
        
                        const startTime = new Date(event.start_time.toString());
                        const endTime = new Date(event.end_time.toString());
                        const difference = endTime.getTime() - startTime.getTime();
                        const hours = Math.floor(difference / (1000 * 60 * 60));
                        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                        const duration = (hours > 0 ? `${hours}h ` : "") + `${minutes}m`;
        
                        return (
                            <div key={event.account_id} className='flex flex-row'>
                                <div className='p-2 pl-6 border-b text-sm'>                        
                                {
                                    startTime.toLocaleString('en-us', { 
                                        weekday: "long", 
                                        year: "numeric", 
                                        month: "short", 
                                        day: "numeric", 
                                        hour: '2-digit', 
                                        minute: '2-digit', 
                                        timeZoneName: 'short'
                                    })
                                }
                                </div>
                                <div className='p-2 pl-6 border-b text-sm'>
                                    Duration: {duration}
                                </div>
                            </div>
                        )
                    }) :
                    <div className="h-40 flex flex-col align-middle justify-center text-center text-sm text-gray-600">No Events</div>
                }
            </div>
    );
        
}
