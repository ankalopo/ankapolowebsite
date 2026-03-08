# Admin Panel Setup Guide

## 🎨 WYSIWYG Admin Panel for Ankapolo Website

Your website now has a complete admin panel where your wife can visually edit pages, manage images, and create new content - just like the old website builders (FrontPage, Dreamweaver style)!

---

## 🚀 Quick Start (Local Testing)

### 1. Make sure dependencies are installed
```bash
npm install
```

### 2. Set admin credentials in `.env`
```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
SESSION_SECRET=random-32-character-string-here
```

**Security Note:** Change the default password! Use a strong password for production.

### 3. Start the server
```bash
npm start
```

### 4. Access the admin panel
Open your browser and go to:
```
http://localhost:3000/admin/login
```

Login with the credentials from your `.env` file.

---

## 📋 Features

### ✅ Dashboard
- View all website pages
- See total pages and images
- Quick actions for creating and managing content
- Access at: `/admin/dashboard`

### ✅ Visual Page Editor (WYSIWYG)
-  **Drag & Drop Components**: Add text, images, videos, columns, etc.
- ✏️ **Click to Edit**: Click any element to change text or properties
- 🎨 **Style Panel**: Change colors, fonts, spacing visually
- 💾 **Auto-save**: Changes save automatically every 2 seconds
- 📱 **Responsive**: Preview desktop, tablet, and mobile views
- Access from dashboard by clicking "Edit" on any page

### ✅ Image Manager
- 📤 **Drag & Drop Upload**: Drag images directly into the browser
- 🖼️ **Visual Gallery**: See all uploaded images in a grid
- 📋 **Copy URLs**: One-click copy image URL or HTML code
- 🗑️ **Delete Images**: Remove unwanted images
- Access at: `/admin/media`

### ✅ Page Management
- ➕ **Create New Pages**: Add new portfolio pages easily
- 📝 **Templates**: Choose blank or portfolio template
- 🗑️ **Delete Pages**: Remove pages you don't need (except homepage)
- 🔗 **Direct Links**: Each page gets its own URL

---

## 🎯 How to Use - Quick Tutorial

### Creating a New Page

1. **Go to Dashboard** (`/admin/dashboard`)
2. Click **"+ New Page"** button
3. Enter page title (e.g., "My New Project")
4. Choose template (Portfolio or Blank)
5. Click **"Create Page"**
6. You'll be taken to  the visual editor

### Editing a Page

1. **From Dashboard**, click **"Edit"** on any page
2. **Visual Editor Opens** with drag-and-drop interface

**Left Panel - Components:**
- Drag "Text" to add paragraphs
- Drag "Image" to add pictures
- Drag "Column" layouts for structure
- Drag "Video", "Map", "Link" etc.

**Click any element** on the canvas to:
- Edit text directly
- Change colors, fonts, sizes
- Add/remove spacing
- Upload and swap images

**Top Toolbar:**
- Save manually with **"Save & Exit"**
- Auto-saves every 2 seconds
- **"Back to Dashboard"** to return

### Uploading Images

1. **Go to Media Manager** (`/admin/media`)
2. **Drag images** into the upload area, or click to browse
3. Images upload automatically
4. Click any image to:
   - View full size
   - Copy URL for use elsewhere
   - Get HTML code
   - Delete if needed

### Using Uploaded Images in Pages

**Method 1 - In the Visual Editor:**
1. Drag an "Image" component onto the page
2. Click the image component
3. In the right panel, click "Browse" under Image
4. Select from your uploaded images

**Method 2 - From Media Manager:**
1. Go to Media Manager
2. Click an image
3. Copy the image URL
4. Paste into the editor's image source field

---

## 🔐 Security Features

- ✅ **Password Protected**: All admin routes require login
- ✅ **Session Based**: 24-hour login sessions
- ✅ **File Type Validation**: Only images can be uploaded
- ✅ **File Size Limits**: 10MB per file maximum

### Changing Admin Password

Edit `.env` file:
```bash
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-new-strong-password
SESSION_SECRET=generate-a-random-32-char-string
```

**Generate a session secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📱 Admin Panel Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Login** | `/admin/login` | Admin authentication |
| **Dashboard** | `/admin/dashboard` | Main control panel |
| **Editor** | `/admin/editor?page=/path` | Visual WYSIWYG editor |
| **Media** | `/admin/media` | Image manager |

---

## 🌐 Production Deployment

### On Your VPS (after following VPS_SETUP.md):

1. **Upload your files** to VPS
2. **Update .env** with production settings:
```bash
ADMIN_USERNAME=your-secure-username
ADMIN_PASSWORD=your-very-strong-password-here
SESSION_SECRET=your-random-32-plus-character-secret-key
```

3. **Set secure session cookie** (edit server.js line 23):
```javascript
cookie: { 
  secure: true, // Enable for HTTPS
  maxAge: 24 * 60 * 60 * 1000
}
```

4. **Restart server**:
```bash
pm2 restart ankapolo-website
```

5. **Access admin panel**:
```
https://yourdomain.com/admin/login
```

---

## 🎨 GrapesJS Editor Tips

### Keyboard Shortcuts
- **Ctrl/Cmd + S**: Manual save
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Shift + Z**: Redo
- **Delete**: Remove selected component

### Adding Custom HTML/CSS
1. In the editor, look for the **Code Icon** (< >) in the top toolbar
2. Click it to edit raw HTML/CSS
3. Paste your custom code
4. Click Apply

### Responsive Design
1. Look for **device icons** in the top toolbar
2. Click desktop, tablet, or mobile icons
3. Edit layouts for each screen size
4. Changes apply only to that breakpoint

### Working with Images
- Click any image component
- Right panel shows "Image" settings
- You can:
  - Upload new image
  - Change image URL
  - Add alt text
  - Add image links
  - Adjust styling

---

## 🔧 Troubleshooting

### "Unauthorized" Error
- **Solution**: Your session expired. Go to `/admin/login` and log in again.

### Can't Upload Images
- **Check**: File size under 10MB?
- **Check**: File type is JPG, PNG, GIF, WEBP, or SVG?
- **Check**: `uploads` folder exists and is writable

### Changes Not Saving
- **Auto-save**: Wait 2 seconds after editing
- **Manual save**: Click "Save & Exit"
- **Check console**: Look for error messages (F12 in browser)

### Page Not Found After Creating
- **Solution**: Refresh the dashboard
- Check the `html` folder for the new file

### Admin Login Not Working
- **Check .env**: Make sure credentials are correct
- **No special characters**: Avoid quotes in password
- **Restart server**: After changing .env

---

## 📁 File Structure

```
ankapolowebsite/
├── admin/               # Admin panel files
│   ├── login.html      # Login page
│   ├── dashboard.html  # Main dashboard
│   ├── editor.html     # Visual WYSIWYG editor
│   └── media.html      # Image manager
├── uploads/            # Uploaded images (auto-created)
├── html/               # Website pages
│   ├── page_2.html
│   ├── page_3.html
│   └── ...
├── server.js           # Main server with admin routes
└── .env               # Configuration (includes admin credentials)
```

---

## 🎓 Training Your Wife

### First Time Setup:
1. Show her how to log in at `/admin/login`
2. Tour the dashboard showing all the pages
3. Click "Edit" on a page to show the editor

### Basic Editing:
1. **Click to Edit**: Show her clicking on text to change it
2. **Drag Components**: Demonstrate dragging a "Text" block onto the page
3. **Upload Image**: Go to Media Manager and upload a test image
4. **Use Image**: Back in editor, drag "Image" component and select uploaded image

### Creating a New Page:
1. Dashboard → "New Page" button
2. Enter title
3. Choose template
4. Start editing

### Saving:
- Explain auto-save (happens automatically)
- Show "Save & Exit" button for manual save
- Show the green "Saved" indicator

---

## 🆘 Support Commands

### Check if server is running:
```bash
pm2 status
```

### View server logs:
```bash
pm2 logs ankapolo-website
```

### Restart server:
```bash
pm2 restart ankapolo-website
```

### Check uploaded files:
```bash
ls -lh uploads/
```

### Check created pages:
```bash
ls -lh html/
```

---

## ✨ What Your Wife Can Do Now

✅ **Edit any page** - Click elements to change text, colors, fonts  
✅ **Add new pages** - Create new portfolio projects  
✅ **Upload images** - Drag & drop photos into the site  
✅ **Change layouts** - Rearrange sections with drag & drop  
✅ **Add new sections** - Text, images, videos, maps, columns  
✅ **Delete old pages** - Remove outdated content  
✅ **Manage images** - See all uploads, copy URLs, delete unused  
✅ **Preview changes** - See mobile/tablet/desktop views  
✅ **Save drafts** - Auto-save means no lost work  

**All without touching code! 🎉**

---

## 🔒 Security Checklist for Production

- [ ] Changed default admin password
- [ ] Used strong password (16+ characters)
- [ ] Generated random SESSION_SECRET (32+ chars)
- [ ] Enabled secure cookies (HTTPS)
- [ ] Set up firewall on VPS
- [ ] Installed SSL certificate
- [ ] Don't share admin credentials
- [ ] Regular backups of website files

---

## 📚 Additional Resources

- **GrapesJS Documentation**: https://grapesjs.com/docs/
- **Component Library**: All available components in left panel of editor
- **Demo Site**: https://grapesjs.com/demo.html (shows what's possible)

---

## 🎉 You're All Set!

Your website now has a complete, user-friendly admin panel. Your wife can edit the entire website without any coding knowledge - just like the old-school website builders!

**Have fun creating! 🎨**
