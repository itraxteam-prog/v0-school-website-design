import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthService } from '@/backend/services/authService';

export function requireAuth(allowedRoles: string[]) {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/portal/login');
    }

    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
        redirect('/portal/login');
    }

    // Check if role is allowed
    // Note: decoded.role might be 'admin' etc.
    if (!allowedRoles.includes(decoded.role)) {
        redirect('/portal/login');
    }

    return decoded;
}
