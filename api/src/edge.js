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
exports.config = void 0;
const database_1 = require("../database");
const calendly_1 = require("./calendly");
// eventId: 3b0bfa02-8d78-4865-ad91-405744270db4
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const platform = req.query.platform;
        const accountID = req.query.accountID;
        const eventID = req.query.eventID; // Retrieve the eventID from the query
        console.log(`[Info] Received request for platform: ${platform}, accountID: ${accountID}, team_event: ${eventID}`);
        if (!platform || !accountID || !eventID) {
            return res.status(400).json({ error: 'Platform, accountID, and eventID are required.' });
        }
        // Record redirection in the database
        const redirectData = {
            account_id: accountID,
            platform: platform,
        };
        yield (0, database_1.createRedirectEntry)(redirectData);
        console.log('[Info] Redirect entry created successfully');
        const token = process.env.BEARER_TOKEN;
        if (!token) {
            console.error('Bearer token not provided!');
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Create a single-use Calendly link
        const calendlyUrl = yield (0, calendly_1.getSchedulingUrl)(eventID, token);
        console.log('[Info] Generated Calendly URL:', calendlyUrl);
        // Redirect user to the generated Calendly link
        res.writeHead(302, { Location: calendlyUrl });
        res.end();
    });
}
exports.default = handler;
exports.config = {
    runtime: 'edge',
};
