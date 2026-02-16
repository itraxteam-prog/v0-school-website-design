import { NextResponse } from 'next/server';

type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    meta?: any;
};

export const createResponse = <T>(
    data: T | null,
    status: number = 200,
    error?: string,
    message?: string,
    meta?: any
) => {
    const body: ApiResponse<T> = {
        success: status >= 200 && status < 300,
    };

    if (data !== null) {
        body.data = data;
    }

    if (error) {
        body.error = error;
    }

    if (message) {
        body.message = message;
    }

    if (meta) {
        body.meta = meta;
    }

    return NextResponse.json(body, { status });
};

export const createErrorResponse = (
    error: string,
    status: number = 400,
    message?: string
) => {
    return createResponse(null, status, error, message);
};

export const createSuccessResponse = <T>(
    data: T,
    status: number = 200,
    message?: string,
    meta?: any
) => {
    return createResponse(data, status, undefined, message, meta);
};
