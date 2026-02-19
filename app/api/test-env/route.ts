export const runtime = 'nodejs'export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        dbUrl: !!process.env.DATABASE_URL
    });
}

