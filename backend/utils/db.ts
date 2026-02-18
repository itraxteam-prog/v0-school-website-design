import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
}

// Connect to the database
export const sql = postgres(DATABASE_URL, {
    ssl: 'require', // Supabase requires SSL 
});
