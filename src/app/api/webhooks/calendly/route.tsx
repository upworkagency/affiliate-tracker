import { NextRequest, NextResponse } from 'next/server';
import { createCalendlyEvent, updateRedirectWithCalendlyEventId } from '../../../../lib/database'; // Import from your actual database module

import { clerkClient } from '@clerk/nextjs';
import { Client, TextChannel } from 'discord.js';

async function sendMessageToDiscord(message: string) {
  const client = new Client({ intents: [] });
  await client.login(process.env.BOT_TOKEN);
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID ?? '');
    if (channel instanceof TextChannel) {
      await channel.send(message);
    } else {
      console.error('Channel is not a text channel');
    }
  } catch (error) {
    console.error('Error fetching the channel:', error);
  } finally {
    client.destroy();
  }
}
export async function POST(req: Request) {
    // Assuming that the POST data is JSON-encoded
    const body = await req.json()
    const eventData = body;

    if (eventData.event === 'invitee.created') {
        // Just an assumption. Modify as per actual data structure
        const payload = eventData.payload
        const email = payload.email; 
        const name = payload.name;
        const rescheduleUrl = payload.reschedule_url;
        const utmSource = String(payload.tracking.utm_source || '');
        const user = await clerkClient.users.getUser(utmSource);
        const closerFirstName = user.firstName ?? ""
        const closerLastName = user.lastName ?? ""
        const uri = payload.uri
        const cancelUrl = payload.cancel_url
        const startTime = payload.scheduled_event.start_time;
        const endTime = payload.scheduled_event.end_time;
        const status = payload.status
        const type = payload.eventType || 'defaultType'; // Replace 'defaultType' with an appropriate value
        
        const formattedStartTime = new Date(startTime.toString()).toLocaleString('en-us', {
            month: "short",
            day: "numeric", 
            hour: '2-digit',
            minute: '2-digit',
        }).replace(/\u2009/g, ' ').replace(' ', ' ')

        await sendMessageToDiscord(`New meeting scheduled on ${formattedStartTime} for closer: ${name}`);

        const calendlyEventId = await createCalendlyEvent({
            account_id: utmSource, // or your account_id
            uri: uri,
            name: name,
            status: status,
            start_time: startTime, // your start time here
            end_time: endTime, // your end time here
            event_type: type,
            event_data: eventData,
            email: email,
            rescheduleUrl: rescheduleUrl,
            cancelUrl: cancelUrl,
            utmSource: null,
            closer: closerFirstName + " " + closerLastName
        });
    
        // Use the returned calendlyEventId to update thea Redirects table
        
        
        try {
            const entry = await updateRedirectWithCalendlyEventId(utmSource, calendlyEventId); 
        } catch (error) {
            console.error('[Error:Webhook]', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }
    }

        return NextResponse.json({ status: 'Received' }, { status: 200 });
  
}
