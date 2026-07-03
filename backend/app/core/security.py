"""Authentication & authorization primitives.

- Passwords are hashed with bcrypt (never stored in plaintext).
- Sessions use short-lived JWT access tokens signed with the server secret.
- Subscription state is embedded in the token claims and re-checked against
  the database on privileged routes, so a cancelled customer loses access
  as soon as their token expires (or immediately on re-check).
"""
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(subject: str, plan: str) -> str:
    settings = get_settings()
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    claims = {"sub": subject, "plan": plan, "exp": expires}
    return jwt.encode(claims, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Return token claims, or None if invalid/expired."""
    try:
        return jwt.decode(token, get_settings().secret_key, algorithms=[ALGORITHM])
    except JWTError:
        return None
