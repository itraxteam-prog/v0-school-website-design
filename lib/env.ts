export function validateEnv() {
    if (!process.env.DATABASE_URL)
        throw new Error("DATABASE_URL missing");

    if (!process.env.NEXTAUTH_SECRET)
        throw new Error("NEXTAUTH_SECRET missing");
}
