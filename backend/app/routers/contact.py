"""
Contact form endpoints
"""
from fastapi import APIRouter, HTTPException, status
import logging
from app.models import ContactRequest, ContactResponse
from app.services.email_service import EmailService

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/contact", response_model=ContactResponse)
async def submit_contact_form(request: ContactRequest):
    """
    Submit a contact form message.

    This endpoint receives contact form submissions and sends them
    via email to the configured recipient address.

    Args:
        request: Contact form data including name, email, and message

    Returns:
        ContactResponse with success status and message

    Raises:
        HTTPException: 500 if email sending fails
        HTTPException: 400 if validation fails
    """
    try:
        logger.info(f"Received contact form submission from {request.email}")

        # Send email
        success = await EmailService.send_contact_email(
            name=request.name,
            email=request.email,
            message=request.message
        )

        if not success:
            logger.error("Failed to send contact form email")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to send message. Please try again later."
            )

        logger.info(f"Successfully processed contact form from {request.email}")
        return ContactResponse(
            success=True,
            message="Thank you for your message! We'll get back to you soon."
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing contact form: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred. Please try again later."
        )
