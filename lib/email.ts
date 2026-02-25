import nodemailer from "nodemailer";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/**
 * Standardized email sending function for production.
 * Throws a controlled error and does not leak internal details.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  try {
    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email delivery error:", error);
    // Throw standard controlled error without leaking internal details
    throw new Error("Failed to send email. Please try again later.");
  }
}

/**
 * Helper to send password reset emails.
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${env.NEXTAUTH_URL}/portal/reset-password?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e293b;">Password Reset Request</h2>
      <p style="color: #475569;">You requested a password reset for your school portal account. Click the button below to set a new password. This link will expire in 1 hour.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail(email, "Reset your password", html);
}

/**
 * Helper to send verification emails.
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${env.NEXTAUTH_URL}/portal/verify-email?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e293b;">Welcome to the Portal</h2>
      <p style="color: #475569;">Please verify your email address to complete your registration.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Email</a>
      </div>
    </div>
  `;

  return sendEmail(email, "Verify your email", html);
}
