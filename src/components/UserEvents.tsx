"use client"
import React, { useState } from 'react';
import { CalendlyEvents } from 'kysely-codegen/dist/db';

interface UserEventProps {
    events: CalendlyEvents[];
}

export const UserEvents: React.FC<UserEventProps> = ({ events }) => {
    const [view, setView] = useState('upcoming');
    const currentDate = new Date();

    if (!events) {
        return <div>No Events</div>;
    }

    const upcomingEvents = events.filter(event => new Date(event.start_time.toString()) > currentDate)
        .sort((a, b) => new Date(a.start_time.toString()).getTime() - new Date(b.start_time.toString()).getTime());

    const passedEvents = events.filter(event => new Date(event.start_time.toString()) < currentDate)
    .sort((a, b) => new Date(b.start_time.toString()).getTime() - new Date(a.start_time.toString()).getTime() );
    const displayedEvents = view === 'upcoming' ? upcomingEvents : passedEvents;

    return (
        <div className='relative first-letter:w-full shadow-md rounded-md p-4 bg-[#272953] h-full'>
            <div className="pb-10">
                <select  value={view} onChange={(e) => setView(e.target.value)} className="bg-white text-black p-2 rounded text-xs absolute">
                    <option className='text-xs' value="upcoming">Upcoming Events</option>
                    <option className='text-xs' value="passed">Passed Events</option>
                </select>
            </div>

            <table className='w-full text-white border-collapse'>
                <thead>
                    <tr>
                        <th className='w-1/4 p-2 border-b border-gray-400 text-left text-xs'>Date & Time</th>
                        <th className='w-1/4 p-2 border-b border-gray-400 text-left text-xs'>Duration</th>
                        <th className='p-2 border-b border-gray-400 text-left text-xs'>Client</th>
                        <th className='p-2 border-b border-gray-400 text-left text-xs'>Closer</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedEvents.length > 0 ? (
                        displayedEvents.map((event, index) => {
                            const startTime = new Date(event.start_time.toString());
                            const endTime = new Date(event.end_time.toString());
                            const difference = endTime.getTime() - startTime.getTime();
                            const hours = Math.floor(difference / (1000 * 60 * 60));
                            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                            const duration = (hours > 0 ? `${hours}h ` : "") + `${minutes}m`;
                            const isEvenRow = index % 2 === 0;

                            return (
                                <tr key={event.account_id} className={isEvenRow ? 'bg-[#1f1f3d]' : ''}>
                                    <td className='p-2 border-b border-gray-400 text-xs'>
                                        {startTime.toLocaleString('en-us', {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }).replace(/\u2009/g, ' ').replace(' ', ' ')}
                                    </td>
                                    <td className='p-2 border-b border-gray-400 text-xs'>{duration}</td>
                                    <td className='p-2 border-b border-gray-400 text-xs'>{event.email}</td>
                                    <td className='p-2 border-b border-gray-400 text-xs'>{event.account_id}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={4} className="p-2 text-center text-gray-600">No Events</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
