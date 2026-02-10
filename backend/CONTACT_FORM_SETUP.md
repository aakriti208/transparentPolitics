# Contact Form Setup Guide

This guide will help you configure the email functionality for the contact form.

## Overview

The contact form sends emails using Gmail's SMTP server. When a user submits the contact form, an email is sent to `info@transparentpolitics.com` (configurable).

## Prerequisites

- Gmail account
- 2-Factor Authentication (2FA) enabled on the Gmail account

## Setup Steps

### 1. Enable 2-Factor Authentication on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Under "Signing in to Google", enable **2-Step Verification**
4. Follow the prompts to set up 2FA

### 2. Generate an App Password

Gmail requires App Passwords for applications that don't support 2FA directly.

1. Go to https://myaccount.google.com/apppasswords
2. Sign in if prompted
3. Select **"Mail"** as the app
4. Select **"Other (Custom name)"** as the device
5. Enter a name like "Transparent Politics Contact Form"
6. Click **"Generate"**
7. Google will display a 16-character password (e.g., `abcd efgh ijkl mnop`)
8. **Copy this password** - you won't be able to see it again

### 3. Configure Environment Variables

Edit the `backend/.env` file and update the SMTP settings:

```env
# SMTP Configuration for Contact Form
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-gmail@gmail.com
SMTP_PASSWORD=abcdefghijklmnop          # Use the App Password (no spaces)
SMTP_FROM_EMAIL=your-gmail@gmail.com
SMTP_TO_EMAIL=ttransparentpolitics@gmail.com
```

**Important:**

- Replace `your-gmail@gmail.com` with your actual Gmail address
- Replace `abcdefghijklmnop` with the App Password you generated (remove spaces)
- The `SMTP_FROM_EMAIL` should be the same as `SMTP_USERNAME`
- The `SMTP_TO_EMAIL` is where contact form submissions will be sent

### 4. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

## Testing

### Test with curl

```bash
curl -X POST http://localhost:8000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message from the contact form."
  }'
```

Expected response:

```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon."
}
```

You should receive an email at the `SMTP_TO_EMAIL` address.

### Test from Frontend

1. Start the frontend:

   ```bash
   cd frontend
   npm start
   ```

2. Navigate to the Contact Us page
3. Fill out the form with valid data
4. Click "Send Message"
5. Verify:
   - Success message appears
   - Form resets
   - Email received at `SMTP_TO_EMAIL`

## Troubleshooting

### "SMTP credentials not configured"

**Problem:** Backend can't find SMTP credentials in environment variables.

**Solution:**

- Verify that `.env` file exists in the `backend/` directory
- Check that `SMTP_USERNAME` and `SMTP_PASSWORD` are set correctly
- Restart the backend server after modifying `.env`

### "Authentication failed"

**Problem:** Gmail is rejecting the credentials.

**Solution:**

- Verify that 2FA is enabled on your Gmail account
- Regenerate the App Password and update `.env`
- Make sure you're using the App Password, not your regular Gmail password
- Remove any spaces from the App Password in `.env`

### "Connection refused" or "Network error"

**Problem:** Can't connect to Gmail's SMTP server.

**Solution:**

- Check your internet connection
- Verify firewall/antivirus isn't blocking port 587
- Some networks block SMTP ports - try a different network

### Email not arriving

**Problem:** No error, but email doesn't arrive.

**Solution:**

- Check the spam/junk folder at `SMTP_TO_EMAIL`
- Verify `SMTP_TO_EMAIL` is set correctly in `.env`
- Check Gmail's "Sent" folder to confirm the email was sent
- Wait a few minutes - email delivery can be delayed

## Security Notes

1. **Never commit `.env` to git** - it's already in `.gitignore`
2. **Use App Passwords** - never use your main Gmail password
3. **Rotate passwords** - regenerate App Passwords periodically
4. **Monitor usage** - check Gmail's activity log for suspicious access
5. **Rate limiting** - consider adding rate limiting in production to prevent abuse

## Production Considerations

For production deployments:

1. **Use a dedicated email service** (SendGrid, AWS SES, Mailgun) instead of Gmail
2. **Add rate limiting** to prevent abuse
3. **Store sensitive credentials** in a secure secrets manager
4. **Enable logging** and monitoring for email failures
5. **Add CAPTCHA** to prevent spam submissions
6. **Consider database storage** of submissions as backup

## Alternative Email Services

While Gmail works well for development, consider these alternatives for production:

- **SendGrid** - 100 free emails/day
- **AWS SES** - Pay-as-you-go, very affordable
- **Mailgun** - 5,000 free emails/month
- **Postmark** - Reliable transactional email service

Each service has its own SMTP settings that can be configured in `.env`.

## API Documentation

### Endpoint: POST /api/v1/contact

**Request Body:**

```json
{
  "name": "string (1-100 characters)",
  "email": "string (valid email format)",
  "message": "string (1-2000 characters)"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Thank you for your message! We'll get back to you soon."
}
```

**Error Response (500):**

```json
{
  "success": false,
  "message": "Failed to send message. Please try again later."
}
```

**Validation Error (422):**

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

## Support

If you encounter issues not covered in this guide, please:

1. Check the backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test with curl to isolate frontend/backend issues
4. Review Gmail's security settings
