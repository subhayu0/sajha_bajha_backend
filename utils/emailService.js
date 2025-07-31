const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html, text) => {
  try {
    const mailOptions = {
      from: `"Sajha Bajha" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed: ', error);
    throw new Error('Email sending failed');
  }
};

const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Sajha Bajha!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to Sajha Bajha!</h2>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for joining Sajha Bajha, your premier destination for musical instruments!</p>
      <p>We're excited to have you as part of our community of music enthusiasts.</p>
      <p>Start exploring our collection of high-quality musical instruments today!</p>
      <br>
      <p>Best regards,<br>The Sajha Bajha Team</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const subject = 'Password Reset Request - Sajha Bajha';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>Dear ${user.firstName},</p>
      <p>You requested a password reset for your Sajha Bajha account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <br>
      <p>Best regards,<br>The Sajha Bajha Team</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

const sendOrderConfirmationEmail = async (user, order) => {
  const subject = `Order Confirmation - ${order.orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Confirmation</h2>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for your order! Your order has been confirmed and is being processed.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Status:</strong> ${order.status}</p>
      </div>
      <p>We'll send you updates as your order progresses.</p>
      <br>
      <p>Best regards,<br>The Sajha Bajha Team</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

const sendOrderStatusUpdateEmail = async (user, order) => {
  const subject = `Order Status Update - ${order.orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Order Status Update</h2>
      <p>Dear ${user.firstName},</p>
      <p>Your order status has been updated.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0;">
        <h3>Order Details:</h3>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>New Status:</strong> ${order.status}</p>
        ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
        ${order.trackingUrl ? `<p><strong>Tracking URL:</strong> <a href="${order.trackingUrl}">Track Package</a></p>` : ''}
      </div>
      <br>
      <p>Best regards,<br>The Sajha Bajha Team</p>
    </div>
  `;

  return sendEmail(user.email, subject, html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail
}; 