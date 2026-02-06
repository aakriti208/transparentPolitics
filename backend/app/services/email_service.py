"""
Email service for sending contact form emails
"""
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aiosmtplib
from app.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails via SMTP"""

    @staticmethod
    async def send_contact_email(name: str, email: str, message: str) -> bool:
        """
        Send a contact form email to the configured recipient.

        Args:
            name: Name of the person submitting the form
            email: Email address of the person submitting the form
            message: Message content

        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        try:
            # Validate SMTP configuration
            if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
                logger.error("SMTP credentials not configured")
                return False

            if not settings.SMTP_FROM_EMAIL:
                logger.error("SMTP from email not configured")
                return False

            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f"Contact Form Submission from {name}"
            msg['From'] = settings.SMTP_FROM_EMAIL
            msg['To'] = settings.SMTP_TO_EMAIL
            msg['Reply-To'] = email

            # Create plain text version
            text_content = f"""
New Contact Form Submission

Name: {name}
Email: {email}

Message:
{message}

---
This email was sent from the Transparent Politics contact form.
"""

            # Create HTML version
            html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #2563eb; color: white; padding: 20px; text-align: center; }}
        .content {{ background-color: #f9fafb; padding: 20px; margin-top: 20px; }}
        .field {{ margin-bottom: 15px; }}
        .field-label {{ font-weight: bold; color: #1f2937; }}
        .field-value {{ margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #2563eb; }}
        .message-box {{ margin-top: 5px; padding: 15px; background-color: white; border-left: 3px solid #2563eb; white-space: pre-wrap; }}
        .footer {{ margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
            <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">{name}</div>
            </div>
            <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:{email}">{email}</a></div>
            </div>
            <div class="field">
                <div class="field-label">Message:</div>
                <div class="message-box">{message}</div>
            </div>
        </div>
        <div class="footer">
            This email was sent from the Transparent Politics contact form.
        </div>
    </div>
</body>
</html>
"""

            # Attach parts
            part1 = MIMEText(text_content, 'plain')
            part2 = MIMEText(html_content, 'html')
            msg.attach(part1)
            msg.attach(part2)

            # Send email
            logger.info(f"Attempting to send email to {settings.SMTP_TO_EMAIL}")

            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                username=settings.SMTP_USERNAME,
                password=settings.SMTP_PASSWORD,
                start_tls=True,
            )

            logger.info(f"Successfully sent contact form email from {email}")
            return True

        except aiosmtplib.SMTPException as e:
            logger.error(f"SMTP error sending email: {str(e)}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending email: {str(e)}")
            return False
