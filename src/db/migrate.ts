import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { type DB  } from "../lib/database";  

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from your specific .env file
config({ path: resolve(__dirname, '../../.env') });

async function migrateToLatest() {
    const poolConfig = {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        database: process.env.POSTGRES_DATABASE,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        max: Number(process.env.POSTGRES_MAX_POOL),
        ssl: {
             rejectUnauthorized: false   
        }
    };
    const dialect = new PostgresDialect({
        pool: new Pool(poolConfig)
    });
  const db = new Kysely<DB>({
    dialect
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, './'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()