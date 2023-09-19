import { NextApiRequest, NextApiResponse } from 'next';
import { createRedirectEntry, type InsertableRedirect } from './database'; // Import from your actual database module

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const eventData = req.body;
        console.log(req.body)

        if (eventData.event === 'invitee.created') {
            const accountID = eventData.payload.invitee.email; // Just an assumption. Modify as per actual data structure

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
