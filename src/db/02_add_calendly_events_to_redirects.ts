import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('redirects')
    .addColumn('calendly_event_id', 'integer', (col) => col.references('calendly_events.id'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('redirects')
    .dropColumn('calendly_event_id')
    .execute();
}
