/**
 * Strong Password Policy Rules:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 * - At least one special character (!@#$%^&* etc.)
 */

export interface PasswordStrength {
    isValid: boolean;
    score: number; // 0-4
    feedback: string[];
    requirements: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
}

export const validatePassword = (password: string): PasswordStrength => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    };

    const feedback: string[] = [];
    if (!requirements.length) feedback.push("Minimum 8 characters");
    if (!requirements.uppercase) feedback.push("At least one uppercase letter");
    if (!requirements.lowercase) feedback.push("At least one lowercase letter");
    if (!requirements.number) feedback.push("At least one number");
    if (!requirements.special) feedback.push("At least one special character");

    const score = Object.values(requirements).filter(Boolean).length - 1; // -1 because length is basic

    return {
        isValid: Object.values(requirements).every(Boolean),
        score: Math.max(0, score),
        feedback,
        requirements,
    };
};
