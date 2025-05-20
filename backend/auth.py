from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import uuid
from datetime import datetime, timedelta

def hash_password(plain):
    return generate_password_hash(plain)

def verify_password(hash, plain):
    return check_password_hash(hash, plain)

def make_user_doc(username, email, pw_plain, role="user"):
    return {
        "username": username,
        "email":    email,
        "password_hash": hash_password(pw_plain),
        "role":     role,
    }
