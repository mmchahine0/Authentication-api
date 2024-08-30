const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({

  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${process.env.BASE_URL}/api/auth/verify-email/${token}">Verify Email</a>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.sendPasswordResetEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${process.env.BASE_URL}/api/auth/reset-password/${token}">Reset Password</a>
    `
  };

  await transporter.sendMail(mailOptions);
};


exports.sendPasswordUpdateEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Update Your Password',
    html: `
      <h1>Update Your Password</h1>
      <p>Click the link below to update your password:</p>
      <a href="${process.env.BASE_URL}/api/auth/update-password/${token}">Reset Password</a>
    `
  };

  await transporter.sendMail(mailOptions);
};
