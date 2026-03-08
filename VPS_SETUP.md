# VPS Setup Guide for Ankapolo Website

## Prerequisites
- A VPS with Ubuntu/Debian (or similar Linux distribution)
- SSH access to your VPS
- A domain name (optional but recommended)

---

## Step 1: Initial VPS Setup

### Connect to your VPS
```bash
ssh root@your-vps-ip
# or
ssh your-username@your-vps-ip
```

### Update system packages
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Node.js (v18 LTS recommended)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Install Git
```bash
sudo apt install -y git
```

---

## Step 2: Setup Email for Contact Form

You have **3 options** for email sending. Choose the one that works best for you:

### **Option 1: Gmail (Easiest for Testing)**

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Create an App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update your .env file:**
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_TO=your-email@gmail.com
   ```

**Note:** Gmail has daily sending limits (500 emails/day). Fine for contact forms.

---

### **Option 2: SendGrid (Free Tier - Recommended for Production)**

1. **Sign up for SendGrid:** https://signup.sendgrid.com/
2. **Get your API key:**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permission
   - Copy the API key

3. **Install SendGrid package:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Update server.js** to use SendGrid instead of nodemailer:
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
   // In the /api/v1/message/ endpoint, replace transporter.sendMail with:
   await sgMail.send(mailOptions);
   ```

5. **Update .env file:**
   ```bash
   SENDGRID_API_KEY=your-sendgrid-api-key
   EMAIL_FROM=your-verified-sender@yourdomain.com
   EMAIL_TO=recipient@example.com
   ```

**Free tier:** 100 emails/day forever

---

### **Option 3: Your VPS SMTP Server (Advanced)**

If you want to send from your own VPS:

1. **Install Postfix:**
   ```bash
   sudo apt install -y postfix mailutils
   # Choose "Internet Site" during setup
   # Enter your domain name
   ```

2. **Configure .env:**
   ```bash
   EMAIL_HOST=localhost
   EMAIL_PORT=25
   EMAIL_SECURE=false
   EMAIL_USER=
   EMAIL_PASS=
   EMAIL_FROM=noreply@yourdomain.com
   EMAIL_TO=your-email@example.com
   ```

**Warning:** Your emails might go to spam without proper SPF/DKIM/DMARC DNS records.

---

## Step 3: Deploy Your Website to VPS

### Create deployment directory
```bash
sudo mkdir -p /var/www/ankapolowebsite
sudo chown $USER:$USER /var/www/ankapolowebsite
cd /var/www/ankapolowebsite
```

### Upload your files
**From your local machine:**
```bash
# Option A: Using rsync (recommended)
rsync -avz --exclude 'node_modules' \
  /home/meno/Documents/menosoft/ankapolowebsite/ \
  your-username@your-vps-ip:/var/www/ankapolowebsite/

# Option B: Using scp
scp -r /home/meno/Documents/menosoft/ankapolowebsite/* \
  your-username@your-vps-ip:/var/www/ankapolowebsite/

# Option C: Using Git (if you have a repository)
git clone https://github.com/yourusername/ankapolowebsite.git /var/www/ankapolowebsite
```

### Install dependencies on VPS
**On your VPS:**
```bash
cd /var/www/ankapolowebsite
npm install
```

### Configure environment variables
```bash
cd /var/www/ankapolowebsite
nano .env
```

**Edit these values:**
```bash
PORT=3000

# Gmail example:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=your-email@gmail.com
EMAIL_TO=your-email@gmail.com

# reCAPTCHA (optional)
VERIFY_RECAPTCHA=false
```

Press `Ctrl+X`, then `Y`, then `Enter` to save.

---

## Step 4: Run Your Website with PM2 (Process Manager)

### Install PM2
```bash
sudo npm install -g pm2
```

### Start your application
```bash
cd /var/www/ankapolowebsite
pm2 start server.js --name "ankapolo-website"
```

### Setup PM2 to auto-start on reboot
```bash
pm2 startup systemd
# Copy and run the command it outputs
pm2 save
```

### Useful PM2 commands
```bash
pm2 status              # Check status
pm2 logs ankapolo-website   # View logs
pm2 restart ankapolo-website  # Restart app
pm2 stop ankapolo-website    # Stop app
pm2 delete ankapolo-website  # Remove from PM2
```

---

## Step 5: Setup Nginx as Reverse Proxy

### Install Nginx
```bash
sudo apt install -y nginx
```

### Create Nginx configuration
```bash
sudo nano /etc/nginx/sites-available/ankapolowebsite
```

**Paste this configuration:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    # For testing: server_name your-vps-ip;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 10M;
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/ankapolowebsite /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### Configure firewall
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## Step 6: Setup SSL Certificate (HTTPS) with Let's Encrypt

### Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Get SSL certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts and choose to redirect HTTP to HTTPS.

### Auto-renewal is automatic
```bash
# Test renewal
sudo certbot renew --dry-run
```

---

## Step 7: Test Everything

### Test the website
1. Visit: `http://yourdomain.com` (or `http://your-vps-ip`)
2. Navigate to the Contact page: `http://yourdomain.com/contact/`
3. Fill out and submit the form
4. Check your email for the message

### Check server logs
```bash
pm2 logs ankapolo-website
```

### Monitor your application
```bash
pm2 monit
```

---

## Troubleshooting

### Contact form not working?

1. **Check email configuration:**
   ```bash
   cd /var/www/ankapolowebsite
   pm2 logs ankapolo-website --lines 50
   ```
   Look for "Email server is ready" message

2. **Test email manually:**
   Create a test file `test-email.js`:
   ```javascript
   require('dotenv').config();
   const nodemailer = require('nodemailer');

   const transporter = nodemailer.createTransport({
     host: process.env.EMAIL_HOST,
     port: parseInt(process.env.EMAIL_PORT),
     secure: process.env.EMAIL_SECURE === 'true',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASS
     }
   });

   transporter.sendMail({
     from: process.env.EMAIL_FROM,
     to: process.env.EMAIL_TO,
     subject: 'Test Email',
     text: 'This is a test email from your VPS'
   })
   .then(() => console.log('✓ Email sent!'))
   .catch(err => console.error('✗ Error:', err));
   ```

   Run: `node test-email.js`

3. **Check firewall:**
   ```bash
   sudo ufw status
   ```

4. **Check Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

### Can't access website?

1. **Check if Node.js is running:**
   ```bash
   pm2 status
   ```

2. **Check if port 3000 is listening:**
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

3. **Check Nginx logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

---

## Updating Your Website

When you make changes locally:

```bash
# From your local machine
rsync -avz --exclude 'node_modules' \
  /home/meno/Documents/menosoft/ankapolowebsite/ \
  your-username@your-vps-ip:/var/www/ankapolowebsite/

# On your VPS
ssh your-username@your-vps-ip
cd /var/www/ankapolowebsite
npm install  # If package.json changed
pm2 restart ankapolo-website
```

---

## Performance Tips

1. **Enable Nginx caching for static files:**
   Add to your Nginx config:
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       expires 30d;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **Compress responses:**
   Already enabled in Nginx by default for text files.

3. **Monitor server resources:**
   ```bash
   htop  # Install: sudo apt install htop
   ```

---

## Security Checklist

- ✅ Firewall enabled (`ufw`)
- ✅ SSL certificate installed
- ✅ `.env` file protected (not in git)
- ✅ Node.js process managed by PM2
- ✅ Regular updates: `sudo apt update && sudo apt upgrade`
- ✅ Strong SSH password or key-based authentication
- ✅ Consider fail2ban: `sudo apt install fail2ban`

---

## Quick Reference

**Your website structure:**
```
VPS Setup:
├── Website files: /var/www/ankapolowebsite/
├── Node.js app: server.js (port 3000)
├── PM2 process: ankapolo-website
├── Nginx: Reverse proxy on port 80/443
└── Logs: pm2 logs ankapolo-website
```

**Common commands:**
```bash
# Application
pm2 restart ankapolo-website
pm2 logs ankapolo-website

# Nginx
sudo systemctl restart nginx
sudo nginx -t

# View logs
pm2 logs ankapolo-website
sudo tail -f /var/log/nginx/error.log

# Update code
rsync -avz --exclude 'node_modules' local-path/ user@vps:/var/www/ankapolowebsite/
pm2 restart ankapolo-website
```

---

## Support

If you encounter issues:
1. Check logs: `pm2 logs ankapolo-website`
2. Check Nginx: `sudo nginx -t && sudo systemctl status nginx`
3. Test email: Create and run the test-email.js script above
4. Verify .env configuration

---

**Good luck with your deployment! 🚀**
