import { VercelRequest, VercelResponse } from '@vercel/node';
import { updateRedirectEntry } from './database'; // Import from your actual database module

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        console.log('[Info:Webhook] Post request received:\n', req.body);
        const eventData = req.body;
        if (eventData.event === 'invitee.created') {
            const accountID = eventData.payload.invitee.email; // Just an assumption. Modify as per actual data structure
            const utmSource = eventData.payload.tracking.utm_source as number
            const entry = await updateRedirectEntry(utmSource);
            console.log('[Info:Webhook] Updated Entry:\n', entry);
        }

        res.status(200).send({ status: 'Received' });
    } else {
        res.status(405).send({ error: 'Method Not Allowed' });
    }
}
