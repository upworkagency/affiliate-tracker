import { createKysely } from "@vercel/postgres-kysely";
// import { Kysely } from 'kysely'
import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | null | number | string;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface CalendlyEvents {
  id: Generated<number>;
  account_id: string | null;
  event_data: any;
  event_timestamp: Generated<Timestamp | null>;
  uri: string;
  name: string;
  status: string;
  start_time: Timestamp;
  end_time: Timestamp;
  event_type: string;
  email: string | null;
  rescheduleUrl: string | null;
  utmSource: string | null;
  cancelUrl: string | null;
  closer: string | null;
}

export interface Redirects {
  id: Generated<number>;
  account_id: string;
  platform: string;
  redirect_timestamp: Generated<Timestamp | null>;
  booked_timestamp: Timestamp | null;
  email: string | null;
  calendly_event_id: number | null;
  first_name: string | null;
  last_name: string | null;
}

export interface DB {
  calendly_events: CalendlyEvents;
  redirects: Redirects;
}

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

export type InsertableRedirect = Omit<Redirects, 'id' | 'booked_timestamp' | 'redirect_timestamp' | 'email'>;

export async function createRedirectEntry(redirect: InsertableRedirect){
    const db = getDbInstance();
    try {
        return await db.insertInto('redirects')
            .values(redirect)
            .returning('id')
            .executeTakeFirstOrThrow();
    } catch (error) {
        // Check if error is a unique constraint violation
        if (error instanceof Error) {
            // Check if error is a unique constraint violation
            if ((error as any).code === '23505') {  // Using 'as any' here to access the 'code' property
                console.error('Duplicate entry detected:', redirect);
                throw new Error('Duplicate entry not allowed');
            }
        }
        throw error;  // Re-throw other errors
    }
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
  export async function updateRedirectWithCalendlyEventId(utmSource: string, calendlyEventId: number) {
    console.log('Inside updateRedirectWithCalendlyEventId');
    console.log('utmSource:', utmSource, 'Type:', typeof utmSource);
    console.log('calendlyEventId:', calendlyEventId, 'Type:', typeof calendlyEventId);
    // rest of your code
        const db = getDbInstance();
    
        // Update the redirect with the calendly_event_id
        return await db.updateTable('redirects')
            .set({ calendly_event_id: calendlyEventId })
            .where('account_id', '=', utmSource)
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
            .distinctOn('redirect_timestamp', 'account_id')
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
        .distinctOn('start_time', 'account_id')
        .innerJoin('calendly_events', 'calendly_events.id', 'redirects.calendly_event_id')
        .where('redirects.calendly_event_id', 'in', ids)
        .selectAll()
        .execute();
}
  