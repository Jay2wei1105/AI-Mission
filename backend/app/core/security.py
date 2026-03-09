"""
Security utilities.

Handles API key validation, JWT verification, etc.
"""

from fastapi import Header, HTTPException


async def verify_api_key(x_api_key: str = Header(default=None)):
    """
    Verify API key from request header.

    For development, this is a no-op. In production, implement
    actual API key validation against Supabase or environment config.
    """
    # TODO: Implement actual API key verification
    # For now, allow all requests in development
    pass
