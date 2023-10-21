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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var pg_1 = require("pg");
var fs_1 = require("fs");
var kysely_1 = require("kysely");
var dotenv_1 = require("dotenv");
var path_1 = require("path");
// Load environment variables from your specific .env file
(0, dotenv_1.config)({ path: (0, path_1.resolve)(__dirname, '../../.env') });
function migrateToLatest() {
    return __awaiter(this, void 0, void 0, function () {
        var poolConfig, dialect, db, migrator, _a, error, results;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    poolConfig = {
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
                    dialect = new kysely_1.PostgresDialect({
                        pool: new pg_1.Pool(poolConfig)
                    });
                    db = new kysely_1.Kysely({
                        dialect: dialect
                    });
                    migrator = new kysely_1.Migrator({
                        db: db,
                        provider: new kysely_1.FileMigrationProvider({
                            fs: fs_1.promises,
                            path: path,
                            migrationFolder: path.join(__dirname, './'),
                        }),
                    });
                    return [4 /*yield*/, migrator.migrateToLatest()];
                case 1:
                    _a = _b.sent(), error = _a.error, results = _a.results;
                    results === null || results === void 0 ? void 0 : results.forEach(function (it) {
                        if (it.status === 'Success') {
                            console.log("migration \"".concat(it.migrationName, "\" was executed successfully"));
                        }
                        else if (it.status === 'Error') {
                            console.error("failed to execute migration \"".concat(it.migrationName, "\""));
                        }
                    });
                    if (error) {
                        console.error('failed to migrate');
                        console.error(error);
                        process.exit(1);
                    }
                    return [4 /*yield*/, db.destroy()];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
migrateToLatest();
