# Ankapolo Website - Contact Form Setup

## Quick Start (Local Testing)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Email Settings

Edit the `.env` file and add your email settings.

**For Gmail (easiest for testing):**
1. Enable 2-Factor Authentication on your Gmail
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=your-email@gmail.com
VERIFY_RECAPTCHA=false
```

### 3. Test Email Configuration

```bash
node test-email.js
```

If successful, you should receive a test email.

### 4. Start the Server

```bash
npm start
```

Visit: http://localhost:3000

### 5. Test Contact Form

1. Go to: http://localhost:3000/contact/
2. Fill out the form
3. Submit
4. Check your email inbox

---

## Production Deployment

See [VPS_SETUP.md](VPS_SETUP.md) for detailed deployment instructions.

---

## Troubleshooting

### "Email configuration error"
- Check your `.env` file
- Verify Gmail App Password is correct (16 characters, no spaces)
- Make sure 2FA is enabled on Gmail

### Form submits but no email
- Check server console for errors: `npm start`
- Run the test script: `node test-email.js`
- Check spam folder

### Port 3000 already in use
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
# Or change PORT in .env
```

---

## File Structure

```
ankapolowebsite/
├── server.js           # Node.js server with contact form endpoint
├── index.html          # Home page
├── html/               # Other pages
│   ├── page_2.html     # Logos & Branding
│   ├── page_3.html     # Illustration
│   ├── page_4.html     # Graphic Design
│   ├── page_5.html     # Architectural
│   ├── page_6.html     # Traditional Medium
│   └── page_7.html     # Contact page
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── images/             # Images
├── .env                # Environment variables (DON'T commit!)
├── .env.example        # Example env file
└── VPS_SETUP.md        # VPS deployment guide
```

---

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (auto-restart on changes)
- `node test-email.js` - Test email configuration
