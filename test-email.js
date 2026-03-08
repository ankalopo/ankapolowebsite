require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n🧪 Testing email configuration...\n');

// Display current configuration (hiding password)
console.log('Email Settings:');
console.log('  HOST:', process.env.EMAIL_HOST || 'Not set');
console.log('  PORT:', process.env.EMAIL_PORT || 'Not set');
console.log('  USER:', process.env.EMAIL_USER || 'Not set');
console.log('  PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'Not set');
console.log('  FROM:', process.env.EMAIL_FROM || 'Not set');
console.log('  TO:', process.env.EMAIL_TO || 'Not set');
console.log('');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Error: EMAIL_USER or EMAIL_PASS not configured in .env file');
  console.log('\nPlease update your .env file with your email credentials.');
  console.log('See README.md for setup instructions.\n');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('Verifying email server connection...');

transporter.verify(function(error, success) {
  if (error) {
    console.error('\n❌ Email configuration error:', error.message);
    console.log('\nTroubleshooting tips:');
    console.log('  • Check EMAIL_USER and EMAIL_PASS in .env file');
    console.log('  • For Gmail, you need an App Password (not your regular password)');
    console.log('  • Enable 2FA and create App Password here:');
    console.log('    https://myaccount.google.com/apppasswords');
    console.log('  • Make sure EMAIL_HOST and EMAIL_PORT are correct\n');
    process.exit(1);
  } else {
    console.log('✅ Email server connection verified!\n');
    console.log('Sending test email...');
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: '✅ Test Email from Ankapolo Website',
      html: `
        <h2>Email Configuration Test</h2>
        <p>✅ <strong>Success!</strong> Your email configuration is working correctly.</p>
        <p>This test email was sent from your Node.js server.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Sent at: ${new Date().toLocaleString()}<br>
          From: ${process.env.EMAIL_HOST}
        </p>
      `,
      text: `
Email Configuration Test

✅ Success! Your email configuration is working correctly.
This test email was sent from your Node.js server.

---
Sent at: ${new Date().toLocaleString()}
From: ${process.env.EMAIL_HOST}
      `
    };

    transporter.sendMail(mailOptions)
      .then(() => {
        console.log('✅ Test email sent successfully!\n');
        console.log(`Check your inbox at: ${process.env.EMAIL_TO}`);
        console.log('(Don\'t forget to check spam folder)\n');
        console.log('🎉 Your contact form is ready to use!\n');
        process.exit(0);
      })
      .catch(err => {
        console.error('\n❌ Failed to send test email:', err.message);
        console.log('\nTroubleshooting tips:');
        console.log('  • Verify EMAIL_FROM and EMAIL_TO are valid email addresses');
        console.log('  • Check your internet connection');
        console.log('  • Gmail might block less secure apps - use App Password instead\n');
        process.exit(1);
      });
  }
});
