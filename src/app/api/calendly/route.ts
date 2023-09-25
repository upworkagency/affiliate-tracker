import { NextResponse, NextRequest } from 'next/server';
import { createRedirectEntry, InsertableRedirect } from '../../../lib/database';
import { getSchedulingUrl } from '../../../lib/calendly';
import { URLSearchParams } from 'url';

export const runtime = 'edge'; // 'nodejs' is the default

export async function GET(req: NextRequest) {
  
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(req.nextUrl.search);
  } catch (error) {
    console.error('[Error:Params]', error);
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const platform = params.get('platform');
  const accountID = params.get('accountID');
  const eventID = params.get('eventID');

  if (!platform || !accountID || !eventID) {
    return NextResponse.json({ error: 'Platform, accountID, and eventID are required.' }, { status: 400 });
  }

  let redirect;
  try {
    const redirectData: InsertableRedirect = {
      account_id: accountID,
      platform: platform,
    };
    redirect = await createRedirectEntry(redirectData);
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
    ? `${calendlyUrl}&utm_source=${redirect.id.toString()}`
    : `${calendlyUrl}?utm_source=${redirect.id.toString()}`;

  return NextResponse.redirect(calendlyUrlWithUtm, 302);
}
