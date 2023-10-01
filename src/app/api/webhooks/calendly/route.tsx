import { NextRequest, NextResponse } from 'next/server';
import { createCalendlyEvent, updateRedirectWithCalendlyEventId } from '../../../../lib/database'; // Import from your actual database module
import type { ColumnType } from "kysely";
// export const runtime = 'edge'; // 'nodejs' is the default

export async function POST(req: NextRequest) {
    // Assuming that the POST data is JSON-encoded
    const body = JSON.parse(req.nextUrl.searchParams.get('body') || '{}');

    // console.log(req.body)

    console.log('[Info:Webhook] Post request received:\n', req.body);
    const eventData = body;

    if (eventData.event === 'invitee.created') {
        // Just an assumption. Modify as per actual data structure
        const payload = eventData.payload
        const email = payload.email; 
        const name = payload.name;
        const rescheduleUrl = payload.reschedule_url;
        const utmSource = payload.tracking.utm_source;
        const uri = payload.uri
        const cancelUrl = payload.cancel_url
        const startTime = payload.scheduled_event.start_time;
        const endTime = payload.scheduled_event.end_time;
        const status = payload.status
        const type = payload.eventType

        const calendlyEventId = await createCalendlyEvent({
            account_id: null, // or your account_id
            uri: uri,
            name: name,
            status: status,
            start_time: startTime, // your start time here
            end_time: endTime, // your end time here
            event_type: type,
            event_data: eventData
        });
    
        // Use the returned calendlyEventId to update the Redirects table
        
        
        try {
            const entry = await updateRedirectWithCalendlyEventId(utmSource, calendlyEventId);  // Assuming '1' is the ID of the redirect you want to update
            console.log('[Info:Webhook] Updated Entry:\n', entry);
        } catch (error) {
            console.error('[Error:Webhook]', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
    }

        return NextResponse.json({ status: 'Received' }, { status: 200 });
  
}
