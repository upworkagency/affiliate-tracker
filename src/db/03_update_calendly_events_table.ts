import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('calendly_events')
  .addColumn('email', 'text')
  .addColumn('rescheduleUrl', 'text')
  .addColumn('utmSource', 'integer') // Assuming it's an integer as you casted it to number
  .addColumn('cancelUrl', 'text')
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
