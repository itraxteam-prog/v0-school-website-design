import { AuthService } from '../services/authService';

export const authRoutes = {
    // POST /auth/login
    login: async (credentials: any) => {
        try {
            if (!credentials || !credentials.email || !credentials.password) {
                return { status: 400, error: 'Email and password are required' };
            }

            const { email, password } = credentials;
            const result = await AuthService.login(email, password);

            if (result.error) {
                return { status: result.status || 401, error: result.error };
            }

            return {
                status: 200,
                data: {
                    user: result.user,
                    token: result.token,
                    refreshToken: result.refreshToken
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
    },

    // POST /auth/change-password
    changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
        try {
            const result = await AuthService.changePassword(userId, currentPassword, newPassword);
            if (!result.success) {
                return { status: 400, error: result.message };
            }
            return { status: 200, data: result };
        } catch (error) {
            console.error('Change password error:', error);
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /auth/forgot-password
    forgotPassword: async (email: string) => {
        try {
            const result = await AuthService.forgotPassword(email);
            return { status: 200, data: result };
        } catch (error) {
            console.error('Forgot password error:', error);
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /auth/reset-password
    resetPassword: async (token: string, newPassword: string) => {
        try {
            const result = await AuthService.resetPassword(token, newPassword);
            if (!result.success) {
                return { status: 400, error: result.message };
            }
            return { status: 200, data: result };
        } catch (error) {
            console.error('Reset password error:', error);
            return { status: 500, error: 'Internal Server Error' };
        }
    }
};
