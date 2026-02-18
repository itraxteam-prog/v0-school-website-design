import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

// Connection disabled for Supabase removal
export const sql = DATABASE_URL ? postgres(DATABASE_URL, {
    ssl: 'require',
}) : ((...args: any[]) => {
    console.warn("SQL Query attempted but DATABASE_URL is missing (Supabase removal phase).");
    return Promise.resolve([]);
}) as any;
