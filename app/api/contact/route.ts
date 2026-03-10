import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, email, phone, subject, message, type } = body

        // Create a transporter using environment variables
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        const isAdmissions = type === "admissions"
        const emailSubject = isAdmissions
            ? `New Admission Inquiry: ${name}`
            : `New Website Message: ${subject || "No Subject"}`

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Sending to the school email
            replyTo: email,
            subject: emailSubject,
            text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone || "Not provided"}
        Type: ${isAdmissions ? "Admission Inquiry" : "General Contact"}
        ${subject ? `Subject: ${subject}` : ""}
        
        Message:
        ${message}
      `,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #800000; border-bottom: 2px solid #800000; padding-bottom: 10px;">
            ${isAdmissions ? "Admission Inquiry" : "Website Message"}
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${phone || "Not provided"}</td>
            </tr>
            ${subject ? `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${subject}</td>
            </tr>` : ""}
          </table>
          <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
            <strong>Message:</strong><br/>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
            This email was sent from the school website contact form.
          </p>
        </div>
      `,
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ message: "Email sent successfully" }, { status: 200 })
    } catch (error) {
        console.error("Email API Error:", error)
        return NextResponse.json({ message: "Failed to send email" }, { status: 500 })
    }
}
