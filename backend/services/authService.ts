import jwt from 'jsonwebtoken';
import { users, User } from '../data/users';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-123';
const TOKEN_EXPIRY = '24h';

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

export const AuthService = {
    login: async (email: string, password: string): Promise<AuthResponse | null> => {
        // Simulate async database call
        await new Promise(resolve => setTimeout(resolve, 100));

        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return null;
        }

        const token = AuthService.generateToken(user);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            token
        };
    },

    generateToken: (user: User): string => {
        return jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );
    },

    verifyToken: (token: string): any => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
};
