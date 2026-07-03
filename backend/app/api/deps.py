"""Shared FastAPI dependencies: DB session, current user, subscription gate."""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.models import User
from app.db.session import get_db

bearer = HTTPBearer(auto_error=False)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    claims = decode_access_token(creds.credentials)
    if not claims:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    user = db.query(User).filter_by(email=claims["sub"]).first()
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unknown user")
    return user


def get_paying_user(user: User = Depends(get_current_user)) -> User:
    """Platform gate: every product route requires an active subscription.
    Non-paying visitors can only ever reach the landing page + auth routes."""
    if not user.has_active_subscription:
        raise HTTPException(status.HTTP_402_PAYMENT_REQUIRED, "Active subscription required")
    return user
