"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedirectEntry = exports.db = void 0;
const pg_1 = require("pg");
const kysely_1 = require("kysely");
const poolConfig = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max: Number(process.env.POSTGRES_MAX_POOL),
};
const dialect = new kysely_1.PostgresDialect({
    pool: new pg_1.Pool(poolConfig)
});
// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
exports.db = new kysely_1.Kysely({
    dialect,
});
function createRedirectEntry(redirect) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.db.insertInto('redirects')
            .values(redirect)
            .returningAll()
            .executeTakeFirstOrThrow();
    });
}
exports.createRedirectEntry = createRedirectEntry;
