import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
  try {
    const info = await transporter.sendMail({
      from: `"Rent Nama" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return { success: true, id: info.messageId };
  } catch (err: any) {
    console.error("Email error:", err);
    return { error: err.message || "Failed to send email" };
  }
}

export function rentDueEmailTemplate(tenantName: string, amount: string, dueDate: string, propertyTitle: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#fcf8fa;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
      <div style="max-width:500px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e2e4;">
        <div style="background:#0f172a;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Rent Nama</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#1b1b1d;font-size:16px;margin:0 0 8px;">Hi ${tenantName},</p>
          <p style="color:#45464d;font-size:14px;margin:0 0 24px;">This is a reminder that your rent payment is due.</p>
          <div style="background:#f6f3f5;border-radius:12px;padding:20px;margin-bottom:24px;">
            <p style="color:#45464d;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin:0 0 4px;">Property</p>
            <p style="color:#1b1b1d;font-size:16px;font-weight:600;margin:0 0 16px;">${propertyTitle}</p>
            <div style="display:flex;gap:24px;">
              <div>
                <p style="color:#45464d;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin:0 0 4px;">Amount</p>
                <p style="color:#1b1b1d;font-size:20px;font-weight:700;margin:0;">${amount}</p>
              </div>
              <div>
                <p style="color:#45464d;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;margin:0 0 4px;">Due Date</p>
                <p style="color:#1b1b1d;font-size:20px;font-weight:700;margin:0;">${dueDate}</p>
              </div>
            </div>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/tenant/payments" style="display:block;background:#0f172a;color:#ffffff;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            View Payment Details
          </a>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e4e2e4;text-align:center;">
          <p style="color:#76777d;font-size:12px;margin:0;">© 2026 Rent Nama. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function contractSignedEmailTemplate(landlordName: string, tenantName: string, propertyTitle: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#fcf8fa;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
      <div style="max-width:500px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e4e2e4;">
        <div style="background:#0f172a;padding:24px 32px;text-align:center;">
          <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">Rent Nama</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#1b1b1d;font-size:16px;margin:0 0 8px;">Hi ${landlordName},</p>
          <p style="color:#45464d;font-size:14px;margin:0 0 24px;">${tenantName} has signed the contract for <strong>${propertyTitle}</strong>.</p>
          <div style="background:#ecfdf5;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
            <p style="color:#059669;font-size:14px;font-weight:600;margin:0;">✓ Contract Activated</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/landlord/contracts" style="display:block;background:#0f172a;color:#ffffff;text-align:center;padding:14px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
            View Contract
          </a>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e4e2e4;text-align:center;">
          <p style="color:#76777d;font-size:12px;margin:0;">© 2026 Rent Nama. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
