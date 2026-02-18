import { AuthService } from '../services/authService';
import { LogService } from '../services/logService';

export const authRoutes = {
    // POST /auth/login
    login: async (credentials: any) => {
        try {
            if (!credentials || !credentials.email || !credentials.password) {
                // Cannot log without user ID, maybe log system warning?
                return { status: 400, error: 'Email and password are required' };
            }

            const { email, password } = credentials;
            const result = await AuthService.login(email, password);

            if (result.error) {
                // Log failed attempt if we could identify the user (not easily possible here without lookup)
                // Integrating log attempts in AuthService might be better, but we do it here if possible.
                // For now, logging general failure with email as context
                LogService.logAction('system', 'guest', 'LOGIN_ATTEMPT', 'AUTH', undefined, 'failure', { email });
                return { status: result.status || 401, error: result.error };
            }

            // Log success
            if (result.user) {
                LogService.logAction(result.user.id, result.user.role, 'LOGIN', 'AUTH', undefined, 'success', { email });
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
            LogService.logError('system', 'system', error, 'Login route');
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /auth/logout
    logout: async (userId: string, role: string) => {
        // Updated signature to include user context for logging
        LogService.logAction(userId, role, 'LOGOUT', 'AUTH', undefined, 'success');
        return {
            status: 200,
            data: { success: true, message: 'Logged out successfully' }
        };
    },

    // POST /auth/change-password
    changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
        try {
            // Need users role for logging - tricky here if not passed. 
            // Assuming caller passes correct userId.
            const result = await AuthService.changePassword(userId, currentPassword, newPassword);
            if (!result.success) {
                LogService.logAction(userId, 'unknown', 'CHANGE_PASSWORD', 'AUTH', undefined, 'failure', { error: result.message });
                return { status: 400, error: result.message };
            }
            LogService.logAction(userId, 'unknown', 'CHANGE_PASSWORD', 'AUTH', undefined, 'success');
            return { status: 200, data: result };
        } catch (error: any) {
            console.error('Change password error:', error);
            LogService.logError(userId, 'unknown', error, 'Change Password');
            return { status: 500, error: 'Internal Server Error' };
        }
    },

    // POST /auth/forgot-password
    forgotPassword: async (email: string) => {
        try {
            const result = await AuthService.forgotPassword(email);
            LogService.logAction('system', 'system', 'FORGOT_PASSWORD_REQUEST', 'AUTH', undefined, 'success', { email });
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
                LogService.logAction('system', 'guest', 'RESET_PASSWORD', 'AUTH', undefined, 'failure', { token });
                return { status: 400, error: result.message };
            }
            LogService.logAction('system', 'guest', 'RESET_PASSWORD', 'AUTH', undefined, 'success');
            return { status: 200, data: result };
        } catch (error) {
            console.error('Reset password error:', error);
            return { status: 500, error: 'Internal Server Error' };
        }
    }
};
