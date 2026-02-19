# Database Configuration (Supabase)

This project uses **Supabase** via the official Supabase JS client.

## Environment Variables

The database connection is managed via Supabase credentials.

- **URL:** `NEXT_PUBLIC_SUPABASE_URL`
- **Anon Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role Key:** `SUPABASE_SERVICE_ROLE_KEY` (Server-side only)

## Tools and Drivers

- **Client:** `@supabase/supabase-js`
- **Utility:** `backend/utils/supabaseClient.ts` exports the `supabase` instance for running queries.

## Usage in Services

To use the database in your backend services, import the `supabase` utility:

```typescript
import { supabase } from '@/backend/utils/supabaseClient';

async function getUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
}
```

## Security (RLS)

This project utilizes Supabase Row Level Security (RLS) to enforce data access policies at the database level. Ensure all tables have appropriate RLS policies configured in the Supabase dashboard.

## Verification

To verify the connection, check the service logs or use the verification scripts if provided.
