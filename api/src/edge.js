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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = require("../database");
function createCalendlyLink(eventTypeUrl, bearerToken) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post('https://api.calendly.com/scheduling_links', {
                max_event_count: 1,
                owner: eventTypeUrl,
                owner_type: 'EventType',
            }, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data.resource.booking_url;
        }
        catch (error) {
            console.error('[Error] Failed to create Calendly link:', error);
            throw error;
        }
    });
}
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const platform = req.query.platform;
        const accountID = req.query.accountID;
        const teamEvent = req.query.team_event; // Retrieve the team_event from the query
        console.log(`[Info] Received request for platform: ${platform}, accountID: ${accountID}, team_event: ${teamEvent}`);
        if (!platform || !accountID || !teamEvent) {
            return res.status(400).json({ error: 'Platform, accountID, and team_event are required.' });
        }
        // Record redirection in the database
        const redirectData = {
            account_id: accountID,
            platform: platform,
        };
        yield (0, database_1.createRedirectEntry)(redirectData);
        console.log('[Info] Redirect entry created successfully');
        // Use the teamEvent for generating the eventTypeUrl
        const eventTypeUrl = `https://api.calendly.com/event_types/${teamEvent}`;
        const token = process.env.BEARER_TOKEN;
        if (!token) {
            console.error('Bearer token not provided!');
            return res.status(500).json({ error: 'Internal server error' });
        }
        // Create a single-use Calendly link
        const calendlyUrl = yield createCalendlyLink(eventTypeUrl, token);
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
