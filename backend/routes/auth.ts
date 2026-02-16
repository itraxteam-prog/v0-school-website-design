import { AuthService } from '../services/authService';

export const authRoutes = {
    // POST /auth/login
    login: async (credentials: any) => {
        try {
            if (!credentials || !credentials.email || !credentials.password) {
                return { status: 400, error: 'Email and password are required' };
            }

            const { email, password, rememberMe } = credentials;
            const result = await AuthService.login(email, password, !!rememberMe);

            if (!result) {
                return { status: 401, error: 'Invalid email or password' };
            }

            return {
                status: 200,
                rememberMe: !!rememberMe,
                data: {
                    user: result.user,
                    token: result.token
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /auth/logout
    logout: async () => {
        return {
            status: 200,
            data: { success: true, message: 'Logged out successfully' }
        };
    }
};
