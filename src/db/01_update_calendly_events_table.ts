import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('calendly_events')
    .addColumn('uri', 'text', col => col.notNull())
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('status', 'text', col => col.notNull())
    .addColumn('start_time', 'timestamp', col => col.notNull())
    .addColumn('end_time', 'timestamp', col => col.notNull())
    .addColumn('event_type', 'text', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('calendly_events')
    .dropColumn('uri')
    .dropColumn('name')
    .dropColumn('status')
    .dropColumn('start_time')
    .dropColumn('end_time')
    .dropColumn('event_type')
    .execute();
}
