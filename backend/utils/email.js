const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendResetEmail = async (to, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
      <h2 style="color: #2563eb;">Reset Your Password</h2>
      <p style="color: #475569;">You requested a password reset. Click the button below to set a new password.</p>
      <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">Reset Password</a>
      <p style="color: #64748b; font-size: 14px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} ProjectNest. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"ProjectNest" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset Your Password",
    html,
  });
};

module.exports = { sendResetEmail };
