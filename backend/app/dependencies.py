from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import User

# Initialize Firebase Admin SDK
# To avoid multiple initialization in dev with hot reload
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Failed to initialize Firebase Admin: {e}")

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verifies the Firebase token and returns the decoded token."""
    token = credentials.credentials
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    decoded_token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
) -> User:
    """Fetches the user from the database based on the firebase_uid."""
    firebase_uid = decoded_token.get("uid")
    if not firebase_uid:
         raise HTTPException(status_code=401, detail="Invalid token")
         
    user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in database")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensures the current user is an admin."""
    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
