import { NextResponse, NextRequest } from 'next/server';
import { createRedirectEntry, InsertableRedirect } from '../../../_lib/database';
import { getSchedulingUrl } from '../../../_lib/calendly';
import { redirect } from 'next/navigation';  


export async function GET(req: NextRequest, res: NextResponse) {
  const searchParams = req.nextUrl.searchParams;

  const platform = searchParams.get('platform');
  const accountID = searchParams.get('accountID');
  const eventID = searchParams.get('eventID');

  if (!platform || !accountID || !eventID) {
    return NextResponse.json({ error: 'Platform, accountID, and eventID are required.' }, { status: 400 });
  }

  let redirectEntry;  // Renamed to avoid conflict with imported redirect function
  try {
    const redirectData: InsertableRedirect = {
      account_id: accountID,
      platform: platform,
    };
    redirectEntry = await createRedirectEntry(redirectData);
  } catch (error) {
    console.error('[Error:Database]', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const token = process.env.BEARER_TOKEN;
  if (!token) {
    console.error('Bearer token not provided!');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }

  let calendlyUrl;
  try {
    calendlyUrl = await getSchedulingUrl(eventID, token);
  } catch (error) {
    console.error('[Error:Calendly]', error);
    return NextResponse.json({ error: 'Error generating Calendly URL' }, { status: 500 });
  }

  const calendlyUrlWithUtm = calendlyUrl.includes('?') 
    ? `${calendlyUrl}&utm_source=${redirectEntry.id.toString()}`
    : `${calendlyUrl}?utm_source=${redirectEntry.id.toString()}`;

  return redirect(calendlyUrlWithUtm);  // Using the imported redirect function
}
