import React from 'react';
import { UserEvents } from '../../components/UserEvents'
import { EditableTable } from '../../components/Table';
import { PieChart } from '../../components/Pie'
import { BarChart } from '../../components/barChart';
import { currentUser, SignIn } from "@clerk/nextjs";
import { getRedirectsById } from '../../lib/database'
import { Suspense } from 'react';

// type ReferralData = {
//   totalRedirects: number;
//   totalCalls: number;
//   redirects: Redirects[];
//   events: CalendlyEvents[];
// };
// export interface CalendlyEvents {
//   id: Generated<number>;
//   account_id: string | null;
//   event_data: Json;
//   event_timestamp: Generated<Timestamp | null>;
// }
export default async function Page() {
    //   const [data, setData] = useState<ReferralData | null>(null);

    const user = await currentUser();
    
    if (!user) return <div>Not logged in</div>;

  const email = user.emailAddresses[0].emailAddress
  const userId = user.id

  const res = await getRedirectsById(userId)

  const redirects = res.filter( (redirect) => redirect.account_id === userId) 

  const scheduled = redirects.filter((event)=> event.calendly_event_id !== null)

  return (
    <div className="bg-gray-50 p-8 flex flex-col">
        <div className='flex flex-row'>
            <div className='h-full w-full flex flex-row mr-6 mb-6'>
                <div className='w-full h-full pr-6'>
                    <Suspense fallback={
                        <div className='flex flex-col justify-center items-center'>
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                            <div className='text-gray-900'>Loading...</div>
                        </div>
                    }>
                        <UserEvents redirects={redirects}/>
                    </Suspense>
                </div>
                
            
                
            </div>
        
         <div className='w-full mr-6 mb-6 border-black rounded-md flex flex-row justify-start'>
            <div className='w-full'>
                <Suspense  fallback={
                    <div className='flex flex-col justify-center items-center'>
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        <div className='text-gray-900'>Loading...</div>
                    </div>
                }>
                    <BarChart redirects={res}/>
                </Suspense>
            </div>
                <div className='w-full h-full align-middle'>
                    <Suspense  fallback={
                        <div className='flex flex-col justify-center items-center'>
                            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                            <div className='text-gray-900'>Loading...</div>
                        </div>
                    }>
                        <PieChart totalRedirects={res.length} redirectsLeadingToCalls={scheduled.length}/>
                    </Suspense>
                </div>
         </div>
        </div>
       
      
        <section className="mb-8 p-6 rounded bg-white shadow-md text-sm">
            <h2 className="text-xl mb-4 font-semibold text-gray-700">Redirects</h2>
            <Suspense fallback={
                            <div className='flex flex-col justify-center items-center'>
                                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                                <div className='text-gray-900'>Loading...</div>
                            </div>
                        }>
                <EditableTable res={res}/>
            </Suspense>
                
        </section>

    </div>
  );
}
