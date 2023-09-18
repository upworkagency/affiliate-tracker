import axios from 'axios';
import { createRedirectEntry, type InsertableRedirect } from '../database';
import { VercelRequest, VercelResponse } from '@vercel/node';

interface CalendlyResponse {
  resource: {
    booking_url: string;
    owner: string;
    owner_type: string;
  };
}

async function createCalendlyLink(eventTypeUrl: string, bearerToken: string): Promise<string> {
  try {
    const response = await axios.post<CalendlyResponse>(
      'https://api.calendly.com/scheduling_links',
      {
        max_event_count: 1,
        owner: eventTypeUrl,
        owner_type: 'EventType',
      },
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.resource.booking_url;
  } catch (error) {
    console.error('[Error] Failed to create Calendly link:', error);
    throw error;
  }
}
  
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const platform = req.query.platform as string;
    const accountID = req.query.accountID as string;
    const teamEvent = req.query.team_event as string;  // Retrieve the team_event from the query
  
    console.log(`[Info] Received request for platform: ${platform}, accountID: ${accountID}, team_event: ${teamEvent}`);
  
    if (!platform || !accountID || !teamEvent) {
      return res.status(400).json({ error: 'Platform, accountID, and team_event are required.' });
    }
  
    // Record redirection in the database
    const redirectData: InsertableRedirect = {
      account_id: accountID,
      platform: platform,
    };
  
    await createRedirectEntry(redirectData);
    console.log('[Info] Redirect entry created successfully');
  
    // Use the teamEvent for generating the eventTypeUrl
    const eventTypeUrl = `https://api.calendly.com/event_types/${teamEvent}`;
    const token = process.env.BEARER_TOKEN;
    if (!token) {
        console.error('Bearer token not provided!');
        return res.status(500).json({ error: 'Internal server error' });
    }
  
    // Create a single-use Calendly link
    const calendlyUrl = await createCalendlyLink(eventTypeUrl, token);
    console.log('[Info] Generated Calendly URL:', calendlyUrl);
  
    // Redirect user to the generated Calendly link
    res.writeHead(302, { Location: calendlyUrl });
    res.end();
}
  

export const config = {
  runtime: 'edge',
};
