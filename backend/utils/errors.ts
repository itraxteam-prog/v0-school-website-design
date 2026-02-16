// Custom Error Classes and Error Handling Utilities

export class AppError extends Error {
    constructor(public message: string, public statusCode: number = 500) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (err: any) => {
    console.error(err);
    // Implementation for centralized error handling
};

export const handleSupabaseError = (error: any) => {
    if (!error) return null;
    console.error('Supabase Error:', error);
    return error.message || 'An unexpected database error occurred';
};
