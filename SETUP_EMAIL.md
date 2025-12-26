# Email Configuration Setup Guide

## Quick Setup

To enable email sending for campaigns, you need to configure SMTP settings in your environment variables.

### Step 1: Create `.env.local` file

Create a file named `.env.local` in the root directory of your project (same level as `package.json`).

### Step 2: Add SMTP Configuration

Copy the following into your `.env.local` file and update with your email credentials:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME=Dazzling Tours

# Base URL for unsubscribe links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 3: Choose Your Email Provider

#### Option A: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Google account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Dazzling Tours" as the name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Update `.env.local`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx xxxx xxxx xxxx  # Use the app password (remove spaces)
   ```

#### Option B: Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

**Custom SMTP Server:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587  # or 465 for SSL
SMTP_USER=your-username
SMTP_PASS=your-password
```

### Step 4: Restart Your Development Server

After updating `.env.local`, restart your Next.js development server:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Verify Configuration

The system will automatically verify your email configuration when you try to send a campaign. If there are any issues, check:

1. **Terminal/Console logs** - Look for error messages
2. **Environment variables** - Make sure `.env.local` is in the root directory
3. **Variable names** - Must be exactly: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## Troubleshooting

### Error: "SMTP configuration is missing"
- **Solution**: Make sure `.env.local` exists and contains `SMTP_USER` and `SMTP_PASS`

### Error: "SMTP connection failed"
- **Solution**: 
  - Check your email and password are correct
  - For Gmail, make sure you're using an App Password, not your regular password
  - Check if your firewall is blocking port 587
  - Verify SMTP_HOST and SMTP_PORT are correct for your provider

### Gmail: "Less secure app access"
- **Solution**: Gmail no longer supports "less secure apps". You MUST use an App Password with 2-Step Verification enabled.

### Emails not sending
- **Check console logs** for detailed error messages
- **Verify SMTP credentials** are correct
- **Test with a simple email** first before sending campaigns

## Security Notes

⚠️ **Important**: Never commit `.env.local` to version control. It should already be in `.gitignore`.

## Production Setup

For production, set these environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Environment Variables
- Other platforms: Check their documentation for setting environment variables

