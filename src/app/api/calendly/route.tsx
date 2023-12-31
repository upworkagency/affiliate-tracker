import { NextResponse, NextRequest } from 'next/server';
import { createRedirectEntry, InsertableRedirect } from '../../../lib/database';
import { getSchedulingUrl } from '../../../lib/calendly'
import { clerkClient } from '@clerk/nextjs';


export const runtime = 'edge' // 'nodejs' is the default

export async function GET(req: NextRequest) {

  const params = req.nextUrl.searchParams

  const platform = params.get('platform');
  const accountID = params.get('accountID');
  console.log("ACCOUNT ID", accountID)
  const eventID = params.get('eventID');

  if (!platform || !accountID || !eventID) {
    return NextResponse.json({ error: 'Platform, accountID, and eventID are required.' }, { status: 400 });
  }

  if (!platform || !accountID || !eventID) {
    return NextResponse.json({ error: 'Platform, accountID, and eventID are required.' }, { status: 400 });
  }
  const user = await clerkClient.users.getUser(accountID);

  let redirect;
  try {
    const redirectData: InsertableRedirect = {
      account_id: accountID,
      platform: platform,
      calendly_event_id: null,
      first_name: user.firstName,
      last_name: user.lastName,
    }
    redirect = await createRedirectEntry(redirectData);
  } catch (error) {
    console.error('[Error:Database]', error)
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
    calendlyUrl = `${calendlyUrl}?utm_source=${accountID}`
  } catch (error) {
    console.error('[Error:Calendly]', error);
    return NextResponse.json({ error: 'Error generating Calendly URL' }, { status: 500 });
  }

  const calendlyUrlWithUtm = calendlyUrl.includes('?') 
    ? `${calendlyUrl}&utm_source=${accountID}`
    : `${calendlyUrl}&utm_source=${accountID}`;

    console.log("Calendly URL", calendlyUrlWithUtm)

  return NextResponse.redirect(calendlyUrlWithUtm, 302);
}
