import { createKysely } from "@vercel/postgres-kysely";
// import { Kysely } from 'kysely'
import { type DB, type Redirects, type CalendlyEvents } from "kysely-codegen";  // We still use the original Kysely for types

let dbInstance: any = null;  // Adjusting this to any, but if @vercel/postgres-kysely provides a specific type, use that instead


function createDatabaseInstance() {
    return createKysely<DB>( );
}

export function getDbInstance() {
    if (!dbInstance) {
        dbInstance = createDatabaseInstance();
    }

    return dbInstance;
}

export type InsertableRedirect = Omit<Redirects, 'id' | 'redirect_timestamp' | 'booked_timestamp' | 'email'>;

export async function createRedirectEntry(redirect: InsertableRedirect){
    const db = getDbInstance();
    return await db.insertInto('redirects')
        .values(redirect)
        .returning('id')
        .executeTakeFirstOrThrow();
}
  type InsertableCalendlyEvent = Omit<CalendlyEvents, 'id' | 'event_timestamp'>;

  // This function creates a new CalendlyEvent and returns the newly created event's ID
  export async function createCalendlyEvent(calendlyEventData: InsertableCalendlyEvent): Promise<number> {
      const db = getDbInstance();
  
      // Insert the Calendly event into the CalendlyEvents table
      const insertedCalendlyEvent = await db.insertInto('calendly_events')
          .values(calendlyEventData)
          .returning('id')
          .executeTakeFirstOrThrow();
  
      return insertedCalendlyEvent.id;
  }
  
  // This function updates the Redirects table with the calendly_event_id
  export async function updateRedirectWithCalendlyEventId(redirectId: string, calendlyEventId: number) {
      const db = getDbInstance();
  
      // Update the redirect with the calendly_event_id
      return await db.updateTable('redirects')
          .set({ calendly_event_id: calendlyEventId })
          .where('id', '=', redirectId)
          .execute();
  }
  

export async function getRedirectsByEmail(email: string): Promise<Redirects[]> {
    const db = getDbInstance();
    return await db.selectFrom('redirects')
        .selectAll()
        .where('email', '=', email)
        .execute();
    }
  export async function getRedirectsById(id: string): Promise<Redirects[]> {
    const db = getDbInstance();
    return await db.selectFrom('redirects')
        .selectAll()
        .where('account_id', '=', id)
        .execute();
    }

export async function getAllRedirects(): Promise<Redirects[]> {
    const db = getDbInstance();
    return await db.selectFrom('redirects')
        .selectAll()
        .execute();
}

export async function getEventsByRedirectIDs(ids: (number | null)[]): Promise<CalendlyEvents[]>{
    const db = getDbInstance();
    const filteredIds = ids.filter(id => id !== null) as number[];

    console.log('filteredIds', filteredIds)
  
    if (!filteredIds.length) {
        return [];
    }
    return await db.selectFrom('redirects')
        .innerJoin('calendly_events', 'calendly_events.id', 'redirects.calendly_event_id')
        .where('redirects.calendly_event_id', 'in', ids)
        .select(['calendly_events.id', 'calendly_events.uri', 'calendly_events.name', 'calendly_events.status', 'calendly_events.start_time', 'calendly_events.end_time', 'calendly_events.event_type'])
        .execute();
}
  