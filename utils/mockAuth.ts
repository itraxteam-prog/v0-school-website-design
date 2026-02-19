import { MOCK_USERS } from '@/utils/mocks';

/**
 * Mock version of withAuth for client-side purely static frontend.
 * In a real Next.js app, this would be a server-side check.
 */
export async function withAuth(allowedRoles: string[]) {
    // Return a mock user based on the first allowed role for demo purposes
    const role = allowedRoles[0];
    const mockUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];

    return {
        id: mockUser.id,
        role: mockUser.role,
        email: mockUser.email,
        name: mockUser.name
    };
}
