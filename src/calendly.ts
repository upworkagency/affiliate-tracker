import axios from 'axios';

export async function getOrganizationURI(organizationName: string, bearerToken: string): Promise<string> {
    try {
        const response = await axios.get(`https://api.calendly.com/users/me`, {
            headers: {
                'authorization': `Bearer ${bearerToken}`
            }
    });
        return response.data.resource.current_organization;;
    } catch (error) {
        console.error('There was an error:', error);
        throw error;
    }
}
export async function getOrganizationsEvents(organizationURI: string, bearerToken: string): Promise<string>{
    try {
        const response = await axios.get(`https://api.calendly.com/event_types?organization=${organizationURI}`, {
            headers: {
                'authorization': `Bearer ${bearerToken}`
            }
        });
        return response.data.resource.scheduling_url;
      } catch (error) {
            console.error('There was an error:', error);
            throw error;
      }
}
// event_id 3b0bfa02-8d78-4865-ad91-405744270db4
export async function getSchedulingUrl(eventID: string, bearerToken: string): Promise<string> {
  try {
    const response = await axios.get(`https://api.calendly.com/event_types/${eventID}`, {
        headers: {
            'authorization': `Bearer ${bearerToken}`
        }
    });
    return response.data.resource.scheduling_url;
  } catch (error) {
    console.error('There was an error:', error);
    throw error;
  }
}

export async function getEventTypesForOrganization(organizationURI: string) {
    try {
      const response = await axios.get(`https://api.calendly.com/event_types?organization=${organizationURI}`, {
        headers: {
          'authorization': `Bearer ${process.env.BEARER_TOKEN}`
        }
      });
      return response.data;  // Adjust depending on the structure of the response data
    } catch (error) {
      console.error('There was an error fetching event types:', error);
      throw error;
    }
}

export const config = {
  runtime: 'edge',
};
