import { type DB, type Redirects } from 'kysely-codegen';// this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

const poolConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max: Number(process.env.POSTGRES_MAX_POOL),
};
  
const dialect = new PostgresDialect({
    pool: new Pool(poolConfig)
});

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