import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('calendly_events')
  .addColumn('email', 'text', col => col.notNull())
  .addColumn('rescheduleUrl', 'text', col => col.notNull())
  .addColumn('utmSource', 'integer', col => col.notNull()) // Assuming it's an integer as you casted it to number
  .addColumn('cancelUrl', 'text', col => col.notNull())
  .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('calendly_events')
     .dropColumn('email')
     .dropColumn('rescheduleUrl')
     .dropColumn('utmSource')
     .dropColumn('cancelUrl')
     .execute();
}
