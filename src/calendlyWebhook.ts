import { VercelRequest, VercelResponse } from '@vercel/node';
import { createRedirectEntry, type InsertableRedirect } from './database'; // Import from your actual database module

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        const eventData = req.body;
        if (eventData.event === 'invitee.created') {
            const accountID = eventData.payload.invitee.email; // Just an assumption. Modify as per actual data structure
            const utmSource = eventData.payload.tracking.utm_source

            const redirect: InsertableRedirect = {
                account_id: accountID,
                platform: 'calendly',
                // Add other necessary properties
            };

            await createRedirectEntry(redirect);
        }

        res.status(200).send({ status: 'Received' });
    } else {
        res.status(405).send({ error: 'Method Not Allowed' });
    }
}
