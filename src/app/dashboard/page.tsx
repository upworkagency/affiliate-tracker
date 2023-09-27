import React, { useState, useEffect } from 'react';
import { Redirects, CalendlyEvents } from '../../../node_modules/kysely-codegen/dist/db';
import { UserEvents } from '../../components/UserEvents'
import { currentUser, SignIn } from "@clerk/nextjs";
import { getRedirectsByEmail } from '../../_lib/database'

type ReferralData = {
  totalRedirects: number;
  totalCalls: number;
  redirects: Redirects[];
  events: CalendlyEvents[];
};
export interface CalendlyEvents {
  id: Generated<number>;
  account_id: string | null;
  event_data: Json;
  event_timestamp: Generated<Timestamp | null>;
}
export default async function Page() {
    //   const [data, setData] = useState<ReferralData | null>(null);

    const user = await currentUser();
    
    if (!user) return <div>Not logged in</div>;

  const email = user.emailAddresses[0].emailAddress
  const userId = user.id

  const res = await getRedirectsByEmail(email)

  console.log("SUCCESFUL RES", res)

  const scheduled = res.filter( (redirect) => redirect.email === email) 

  return (
    <div className="bg-gray-50 min-h-screen p-8 flex flex-col">
        <div className='flex flex-row'>
            <div className='h-full w-full mr-6 mb-6'>
                <UserEvents redirects={scheduled}/>
            </div>
        
         <div className='w-full h-40 max-h-40  border-black rounded-md'>
                hi
         </div>
        </div>
       
      
      <section className="mb-8 p-6 rounded bg-white shadow-md text-sm">
        <h2 className="text-xl mb-4 font-semibold text-gray-700">Redirects</h2>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 ">
            <tr>
              <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">ID</th>
              <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">Platform</th>
              <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">Timestamp</th>
              <th className="px-6 py-2 border-b border-gray-300 text-left text-sm leading-4 text-gray-600">Booked</th>
            </tr>
          </thead>
          <tbody>
            {res.map(redirect => (
              <tr key={redirect.id.toString()}>
                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">{redirect.id.toString()}</td>
                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">{redirect.platform}</td>
                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">{
                    new Date(redirect.redirect_timestamp?.toString()).toLocaleString('en-us', { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "short", 
                        day: "numeric", 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        // second: '0-digit', 
                        timeZoneName: 'short'
                    })
                }</td>
                <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-300">{redirect.booked_timestamp?.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
