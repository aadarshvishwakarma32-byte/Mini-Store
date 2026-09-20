const environment = require('../config/environment');

const sendPasswordResetEmail = async ({ email, resetUrl }) => {
  // Resend is used through its HTTPS API, so no additional server package is
  // required. Set RESEND_API_KEY and MAIL_FROM in .env to enable delivery.
  if (!environment.RESEND_API_KEY) {
    if (environment.NODE_ENV !== 'production') {
      console.info(
        `[password reset] Email delivery is not configured. Reset link for ${email}: ${resetUrl}`
      );
    }
    return { delivered: false };
  }

  const html = `
    <h1>Reset your Mini Store password</h1>
    <p>We received a request to reset your password.</p>
    <p><a href="${resetUrl}">Reset password</a></p>
    <p>This link expires in 15 minutes. If you did not request it, you can safely ignore this email.</p>`;

  const mailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${environment.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: environment.MAIL_FROM,
      to: [email],
      subject: 'Reset your Mini Store password',
      html,
    }),
  });

  if (!mailResponse.ok) {
    const errorBody = await mailResponse.text();
    throw new Error(`Password reset email could not be sent: ${errorBody}`);
  }
  return { delivered: true };
};

module.exports = { sendPasswordResetEmail };
