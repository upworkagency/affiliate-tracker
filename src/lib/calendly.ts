// Explicitly tell axios to use the http adapter
// axios.defaults.adapter = require('axios/lib/adapters/http');
export async function getOrganizationURI(organizationName: string, bearerToken: string): Promise<string> {
  try {
      const response = await fetch(`https://api.calendly.com/users/me`, {
          headers: {
              'authorization': `Bearer ${bearerToken}`
          }
      });
      
      const data = await response.json();
      return data.resource.current_organization;
  } catch (error) {
      console.error('There was an error:', error);
      throw error;
  }
}

export async function getOrganizationsEvents(organizationURI: string, bearerToken: string): Promise<string>{
  try {
      const response = await fetch(`https://api.calendly.com/event_types?organization=${organizationURI}`, {
          headers: {
              'authorization': `Bearer ${bearerToken}`
          }
      });
      
      const data = await response.json();
      return data.resource.scheduling_url;
  } catch (error) {
      console.error('There was an error:', error);
      throw error;
  }
}

export async function getSchedulingUrl(eventID: string, bearerToken: string): Promise<string> {
  try {
      const response = await fetch(`https://api.calendly.com/event_types/${eventID}`, {
          headers: {
              'authorization': `Bearer ${bearerToken}`
          }
      });

      const data = await response.json();
      return data.resource.scheduling_url;
  } catch (error) {
      console.error('There was an error:', error);
      throw error;
  }
}

export async function getEventTypesForOrganization(organizationURI: string) {
  try {
      const response = await fetch(`https://api.calendly.com/event_types?organization=${organizationURI}`, {
          headers: {
              'authorization': `Bearer ${process.env.BEARER_TOKEN}`
          }
      });

      return await response.json();
  } catch (error) {
      console.error('There was an error fetching event types:', error);
      throw error;
  }
}

export async function getScheduledEvent(eventUuid: string, inviteeUuid: string) {
  try {
      const response = await fetch(`https://api.calendly.com/scheduled_events/${eventUuid}/invitees/${inviteeUuid}`);

      return await response.json();
  } catch (error) {
      console.error('There was an error fetching event types:', error);
      throw error;
  }
}


// export const config = {
//   runtime: 'edge',
// };
