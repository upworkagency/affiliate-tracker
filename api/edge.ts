export const config = {
    runtime: 'edge',
  }
  
  // http://localhost:3000/api/edge?email=test@test.com
  
  export default async function handler(req) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    // record 'id' in database

    // Update calendly 
  }