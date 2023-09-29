import React from 'react'
import { Redirects } from 'kysely-codegen/dist/db'

interface UserEventProps {
    redirects: Redirects[]
}

export const UserEvents: React.FC<UserEventProps> = ({ redirects }) => {
    const currentDate = new Date();  // Get the current date and time

    const upcomingEvents = redirects
        .filter(redirect => new Date(redirect.redirect_timestamp.toString()) > currentDate); // Filter out past events

    return (
        <div className='w-full shadow-md rounded-md p-6 bg-white h-[275px]'>
            <h2 className="text-xl font-semibold text-gray-700"> Upcoming Events: </h2>
            {
                upcomingEvents.length > 0 ? 
                upcomingEvents.map((redirect) => (
                    <div className='p-2 pl-6 border-b text-sm'>                        
                        {
                            new Date(redirect.redirect_timestamp.toString()).toLocaleString('en-us', { 
                                weekday: "long", 
                                year: "numeric", 
                                month: "short", 
                                day: "numeric", 
                                hour: '2-digit', 
                                minute: '2-digit', 
                                second: '2-digit', 
                                timeZoneName: 'short'
                            })
                        }
                    </div>
                )) :
                <div className="h-40 flex flex-col align-middle justify-center text-center text-sm text-gray-600">No Events</div>
            }
        </div>
    )
}
