import nodemailer from "nodemailer";
import { env } from "./env";
import { logger } from "./logger";

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
 * Internal async sender that does not block the main execution flow.
 * Handles its own errors and logs them.
 */
async function sendAsync(options: nodemailer.SendMailOptions) {
  try {
    const info = await transporter.sendMail({
      from: env.SMTP_FROM,
      ...options,
    });
    logger.info({
      to: options.to,
      subject: options.subject,
      messageId: info.messageId
    }, "Email sent successfully");
  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : "Unknown error",
      to: options.to,
      subject: options.subject,
      stack: error instanceof Error ? error.stack : undefined,
      smtp: {
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        user: env.SMTP_USER
      }
    }, "Email delivery failed");
  }
}

/**
 * Standardized email sending function for production.
 * This is NON-BLOCKING (fire-and-forget).
 */
export function sendEmail(
  to: string,
  subject: string,
  html: string
): void {
  // Fire and forget - do not await
  sendAsync({ to, subject, html }).catch((err) => {
    // This catch is a safeguard for the async function itself, 
    // though sendAsync already has a try/catch.
    logger.fatal({ err }, "Unhandled promise rejection in email sender");
  });
}

/**
 * Helper to send password reset emails.
 */
export function sendPasswordResetEmail(email: string, token: string) {
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

  sendEmail(email, "Reset your password", html);
}

/**
 * Helper to send verification emails.
 */
export function sendVerificationEmail(email: string, token: string) {
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

  sendEmail(email, "Verify your email", html);
}

/**
 * Helper to send announcement notifications to multiple recipients.
 */
export function sendAnnouncementEmail(emails: string[], title: string, content: string) {
  if (emails.length === 0) return;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e293b;">New Announcement: ${title}</h2>
      <div style="color: #475569; line-height: 1.6; margin: 20px 0;">
        ${content.replace(/\n/g, '<br>')}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.NEXTAUTH_URL}/portal" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View in Portal</a>
      </div>
      <p style="color: #64748b; font-size: 12px; border-top: 1px solid #f1f5f9; pt-4;">You are receiving this because an announcement was made on the school portal.</p>
    </div>
  `;

  // Log the attempt
  logger.info({
    recipientCount: emails.length,
    announcementTitle: title
  }, "Processing announcement email broadcast");

  sendAsync({
    bcc: emails,
    subject: `New Announcement: ${title}`,
    html
  }).catch((err) => {
    logger.fatal({ err }, "Unhandled promise rejection in announcement email sender");
  });
}

