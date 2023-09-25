import { NextRequest, NextResponse } from 'next/server';
import { updateRedirectEntry } from '../../../../lib/database'; // Import from your actual database module

export const runtime = 'edge'; // 'nodejs' is the default

export default async function handler(req: NextRequest) {
    // Assuming that the POST data is JSON-encoded
    const body = JSON.parse(req.nextUrl.searchParams.get('body') || '{}');
    const method = req.nextUrl.searchParams.get('method');

    if (method === 'POST') {
        console.log('[Info:Webhook] Post request received:\n', body);
        const eventData = body;

        if (eventData.event === 'invitee.created') {
            // Just an assumption. Modify as per actual data structure
            const email = eventData.payload.email; 
            const utmSource = eventData.payload.tracking.utm_source as number;
            
            try {
                const entry = await updateRedirectEntry(utmSource, email);
                console.log('[Info:Webhook] Updated Entry:\n', entry);
            } catch (error) {
                console.error('[Error:Webhook]', error);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }
        }

        return NextResponse.json({ status: 'Received' }, { status: 200 });
    } else {
        return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
    }
}
