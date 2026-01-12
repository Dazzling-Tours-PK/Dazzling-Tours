# Services Setup Guide

This guide will help you configure MongoDB Atlas, Cloudinary, and Mailtrap for the Dazzling Tours application.

## Table of Contents

1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Cloudinary Setup](#cloudinary-setup)
3. [Mailtrap Setup](#mailtrap-setup)
4. [Environment Variables](#environment-variables)

---

## MongoDB Atlas Setup

### Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (or log in if you already have one)
3. Create a new cluster (Free tier is available)

### Step 2: Get Your Connection String

1. In your MongoDB Atlas dashboard, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** as your driver
4. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/dazzling-tours
   ```

### Step 3: Configure Database Access

1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Create a username and password (save these credentials!)
4. Set user privileges to **"Read and write to any database"**
5. Click **"Add User"**

### Step 4: Configure Network Access

1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For development, click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. For production, add specific IP addresses
5. Click **"Confirm"**

### Step 5: Update Environment Variables

Add your connection string to `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dazzling-tours?retryWrites=true&w=majority
```

**Important:** Replace `username` and `password` with your actual database user credentials.

---

## Cloudinary Setup

### Step 1: Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account (or log in)
3. Complete the registration process

### Step 2: Get Your API Credentials

1. Once logged in, you'll be taken to your dashboard
2. Your **Cloud Name** is displayed at the top
3. Click on **"Settings"** (gear icon) or go to the **"Settings"** tab
4. Scroll down to **"Product Environment Credentials"**
5. You'll see:
   - **Cloud Name** (e.g., `dazzling-tours`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

### Step 3: Update Environment Variables

Add your Cloudinary credentials to `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Important:** Keep your API Secret secure and never commit it to version control!

### Step 4: Test the Configuration

The application will automatically use Cloudinary for image uploads. When you upload images through the admin panel, they will be stored in Cloudinary and served via CDN.

---

## Mailtrap Setup

### Step 1: Create a Mailtrap Account

1. Go to [Mailtrap](https://mailtrap.io)
2. Sign up for a free account (or log in)
3. Complete the registration process

### Step 2: Get Your SMTP Credentials

1. Once logged in, go to your **"Inboxes"** section
2. Select an inbox (or create a new one)
3. Click on the inbox to view its settings
4. Go to **"SMTP Settings"** tab
5. Select **"Node.js - Nodemailer"** from the dropdown
6. You'll see:
   - **Host**: `sandbox.smtp.mailtrap.io`
   - **Port**: `2525`
   - **Username**: (your Mailtrap username)
   - **Password**: (your Mailtrap password)

### Step 3: Update Environment Variables

Add your Mailtrap credentials to `.env.local`:

```env
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-username
MAILTRAP_PASS=your-mailtrap-password
```

### Step 4: Test Email Sending

1. Send a test email from your application (e.g., through a contact form or campaign)
2. Go back to your Mailtrap inbox
3. You should see the email appear in the inbox
4. Click on it to view the email content

**Note:** Mailtrap is for development/testing only. For production, use a real SMTP service (Gmail, SendGrid, etc.) by configuring the `SMTP_*` environment variables instead.

---

## Environment Variables

Create a `.env.local` file in the root directory with all your credentials:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dazzling-tours?retryWrites=true&w=majority

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Mailtrap (Development)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your-mailtrap-username
MAILTRAP_PASS=your-mailtrap-password

# SMTP (Production - Optional, only if not using Mailtrap)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
SMTP_FROM_NAME=Dazzling Tours

# Other existing variables...
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Verification

After setting up all services, restart your development server:

```bash
npm run dev
```

Check the console for connection messages:

- ✅ `Connected to MongoDB` (Atlas)
- ✅ No Cloudinary errors when uploading images
- ✅ No email service errors when sending emails

---

## Troubleshooting

### MongoDB Atlas Connection Issues

- **Error: "Authentication failed"**

  - Verify your username and password in the connection string
  - Check that the database user has the correct permissions

- **Error: "Connection timeout"**
  - Verify your IP address is whitelisted in Network Access
  - Check your internet connection

### Cloudinary Upload Issues

- **Error: "Invalid API credentials"**

  - Double-check your Cloud Name, API Key, and API Secret
  - Ensure there are no extra spaces in the environment variables

- **Error: "Upload failed"**
  - Check your Cloudinary account limits (free tier has limits)
  - Verify the image format is supported (JPEG, PNG, WebP)

### Mailtrap Issues

- **Error: "SMTP connection failed"**
  - Verify your Mailtrap credentials are correct
  - Check that you're using the correct port (2525)
  - Ensure you're using the "sandbox" host for testing

---

## Production Considerations

### MongoDB Atlas

- Use a dedicated cluster (not free tier) for production
- Configure IP whitelist with specific IPs only
- Enable database backups
- Use connection pooling

### Cloudinary

- Upgrade to a paid plan for production
- Configure image transformations and optimizations
- Set up CDN for better performance
- Monitor usage and bandwidth

### Email Service

- Replace Mailtrap with a production email service:
  - **SendGrid** (recommended)
  - **Amazon SES**
  - **Mailgun**
  - **Gmail SMTP** (for small volumes)
- Update `SMTP_*` environment variables
- Set up email delivery monitoring
- Configure SPF and DKIM records for your domain

---

## Support

If you encounter any issues, check:

1. Environment variables are correctly set in `.env.local`
2. All credentials are valid and active
3. Network/firewall settings allow connections
4. Service account limits haven't been exceeded

For more information, refer to:

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Mailtrap Documentation](https://mailtrap.io/docs/)
