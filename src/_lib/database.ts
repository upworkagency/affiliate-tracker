import { createKysely } from "@vercel/postgres-kysely";
// import { Kysely } from 'kysely'
import { type DB, type Redirects } from "kysely-codegen";  // We still use the original Kysely for types

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

export async function createRedirectEntry(redirect: InsertableRedirect) {
    const db = getDbInstance();
    return await db.insertInto('redirects')
        .values(redirect)
        .returning('id')
        .executeTakeFirstOrThrow();
}

export async function updateRedirectEntry(id: number, email: string) {
    const db = getDbInstance();
    return await db.updateTable('redirects')
        .set({ booked_timestamp: new Date(), email: email })
        .where('redirects.id', '=', id)
        .executeTakeFirstOrThrow();
}

export async function getRedirectsByEmail(email: string): Promise<Redirects[]> {
    const db = getDbInstance();
    return await db.selectFrom('redirects')
      .selectAll()
      .where('email', '=', email)
      .execute();
  }
  