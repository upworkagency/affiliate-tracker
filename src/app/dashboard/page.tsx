import React from 'react';
import { UserEvents } from '../../components/UserEvents'
import { EditableTable } from '../../components/Table';
import { PieChart } from '../../components/Pie'
import { BarChart } from '../../components/barChart';
import { LineChart } from '../../components/lineChart';
import { currentUser, SignIn } from "@clerk/nextjs";
import { getRedirectsById } from '../../lib/database'
import { Suspense } from 'react';
import { Redirects } from 'kysely-codegen'

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
// // }

export default async function Page() {
    //   const [data, setData] = useState<ReferralData | null>(null);

    const user = await currentUser();
    
    if (!user) return <div>Not logged in</div>;

  const email = user.emailAddresses[0].emailAddress
  const userId = user.id

  const res = await getRedirectsById(userId)
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


  const redirects = res.filter( (redirect) => redirect.account_id === userId) 

  const counts = generateCounts(redirects);

  const scheduled = redirects.filter((event)=> event.calendly_event_id !== null)

  return (
    <div className="bg-[#16113A] p-8 flex flex-col">
        <div className='flex flex-wrap w-full'>
            <div className='flex-grow w-full sm:w-1/2 p-2'>
                <Suspense fallback={
                    <div className='flex flex-col justify-center items-center'>
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        <div className='text-gray-900'>Loading...</div>
                    </div>
                }>
                    <UserEvents redirects={redirects}/>
                </Suspense>
            </div>

            <div className='w-full sm:w-1/2 p-2'>
                <Suspense  fallback={
                    <div className='flex flex-col justify-center items-center'>
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                        <div className='text-gray-900'>Loading...</div>
                    </div>
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
                            <div className='flex flex-col justify-center items-center'>
                                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                                <div className='text-gray-900'>Loading...</div>
                            </div>
                        }>
                            <EditableTable res={res}/>
                        </Suspense>
                    </div>
                </div>
            </div>

            <div className='w-full sm:w-1/2 p-2'>
                <div className='h-full bg-[#272953] p-3 rounded-lg'>
                    <LineChart redirects={redirects}/>
                </div>
            </div>
        </section>

    </div>
  );

}
