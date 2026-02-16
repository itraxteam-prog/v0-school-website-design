# Database Configuration (Supabase)

This project uses **Supabase** via a direct PostgreSQL connection.

## Environment Variables

The database connection is managed via the `DATABASE_URL` environment variable.

- **Local:** Defined in `.env.local`
- **Production/Vercel:** Must be set in the Vercel Project Settings.

### Connection String
```text
postgresql://[user]:[password]@[host]:5432/postgres
```
*Note: Special characters in the password (like `#` or `*`) have been URL-encoded to ensure compatibility with database drivers.*

## Tools and Drivers

- **Client:** `postgres.js` (installed via `pnpm add postgres`)
- **Utility:** `backend/utils/db.ts` exports the `sql` instance for running queries.

## Usage in Services

To use the database in your backend services, import the `sql` utility:

```typescript
import { sql } from '@/backend/utils/db';

async function getUsers() {
    const users = await sql`SELECT * FROM users`;
    return users;
}
```

## Verification

To verify the connection locally, run:
```bash
pnpm tsx backend/scripts/verify-db.ts
```

## Planned Transition

The backend is currently moving from dummy JSON data (`backend/data/*.ts`) to direct SQL queries. All services in `backend/services/` should be updated to use the `sql` client.
