import { type DB, type  Redirects } from 'kysely-codegen';// this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'test',
    host: 'localhost',
    user: 'admin',
    port: 5434,
    max: 10,
  })
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.

export const db = new Kysely<DB>({
  dialect,
})

export type InsertableRedirect = Omit<Redirects, 'id' | 'redirect_timestamp'>;

export async function createRedirectEntry(redirect: InsertableRedirect) {
    return await db.insertInto('redirects')
        .values(redirect)
        .returningAll()
        .executeTakeFirstOrThrow();
}