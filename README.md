# Affiliate Link Tracker System

## Description

`affiliate-tracker` is a specialized system developed to set up an API that captures query-parameters when users activate an affiliate link. Exclusively designed to work with Calendly, it facilitates marketers and agencies by dynamically generating meeting schedules upon redirection.

---

## Features

1. **Affiliate Link Parsing**:
   - Intercept and parse query-parameters to fetch affiliate details like origin, platform, and specific events.

2. **Database Integration**:
   - Seamless integration with PostgreSQL using Kysely ORM.
   - Logs every redirection for analytical purposes.

3. **Exclusive Calendly Integration**:
   - Generates single-use Calendly links based on event IDs.
   - Automates user redirection to these dynamic schedules.

---

## Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to Project Directory**:
   ```bash
   cd affiliate-tracker
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   - Set up PostgreSQL parameters: `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DATABASE`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_MAX_POOL`.
   - Configure Calendly API access: `BEARER_TOKEN`.

5. **Build & Run**:
   ```bash
   npm run build
   npm start
   ```

Access the API locally at: [http://localhost:3000](http://localhost:3000).

---

## Usage

Activate the affiliate link in the following format:

```
http://your-deployed-url.com/booking?platform=<PLATFORM>&accountID=<ACCOUNT_ID>&eventID=<EVENT_ID>
```

Example:

```
http://your-deployed-url.com/booking?platform=tiktok&accountID=test&eventID=3b0bfa02-8d78-4865-ad91-405744270db4
```

---

## API Endpoints

- **Organization's URI**:
   - Fetch a Calendly organization's URI.

- **Organization Events**:
   - Retrieve events linked with a specific organization on Calendly.

- **Scheduling URL Generation**:
   - Formulate a scheduling URL based on given event IDs.

---

## Hosting on Vercel

The system is tailored to be hosted on Vercel. To deploy, follow Vercel's deployment guide and ensure that the required environment variables (`DATABASE_URL` and `BEARER_TOKEN`) are set in your Vercel project settings.

---

## Author

Lucas Raza

---

## License

ISC
