from flask import Blueprint, request, jsonify
from db import mongo
import uuid
from auth import make_user_doc, verify_password, hash_password
from bson import ObjectId
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies
)
from datetime import timedelta
import os
from werkzeug.utils import secure_filename
from itsdangerous import URLSafeTimedSerializer
from utils.email_utils import send_email

serializer = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    # TODO: Query DB to see if user exists
    user = {"id": 1, "email": email}  # TEMP for testing
    if not user:
        return jsonify({"message": "If that email exists, a reset link has been sent"}), 200

    token = serializer.dumps(email, salt="password-reset-salt")
    reset_url = f"http://localhost:5173/reset-password/{token}"

    html_content = f"""
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="{reset_url}">{reset_url}</a>
    <p>This link expires in 1 hour.</p>
    """
    send_email(email, "Password Reset Request", html_content)

    return jsonify({"message": "If that email exists, a reset link has been sent"}), 200


@auth_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    try:
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
    except SignatureExpired:
        return jsonify({"error": "Token expired"}), 400
    except BadSignature:
        return jsonify({"error": "Invalid token"}), 400

    data = request.get_json()
    new_password = data.get("password")
    if not new_password:
        return jsonify({"error": "Password required"}), 400

    # TODO: Hash and update in DB
    print(f"🔐 Would reset password for {email} to {new_password}")

    return jsonify({"message": "Password updated successfully"}), 200





def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route("/upload-profile-picture", methods=["POST"])
@jwt_required()
def upload_profile_picture():
    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # If filename exists, append a UUID
        if os.path.exists(filepath):
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{uuid.uuid4().hex}{ext}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        # Update MongoDB
        user_id = get_jwt_identity()
        image_path = f"/{filepath}"  # relative path to static

        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"profilePicture": image_path}}
        )

        return jsonify({"message": "Image uploaded", "imageUrl": image_path}), 200

    return jsonify({"error": "Invalid file type"}), 400

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Missing fields"}), 400

    profile_pic = data.get("profilePicture", "")

    user_doc = {
        "username": data["username"],
        "email": data["email"],
        "password_hash": hash_password(data["password"]),
        "role": "user",
        "profilePicture": profile_pic
    }

    try:
        res = mongo.db.users.insert_one(user_doc)
    except Exception:
        return jsonify({"error": "Username or email already exists"}), 409

    return jsonify({"message": "User created", "id": str(res.inserted_id)}), 201


@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200 

    data = request.get_json() or {}
    user = mongo.db.users.find_one({"username": data.get("username")})
    if not user or not verify_password(user.get("password_hash", ""), data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user["_id"]), expires_delta=timedelta(hours=8))
    resp = jsonify({
        "username": user["username"],
        "email": user["email"],
        "role": user["role"]
    })
    set_access_cookies(resp, access_token)
    return resp, 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    resp = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(resp)
    return resp, 200

@auth_bp.route("/profile-data", methods=["GET"])
@jwt_required()
def profile_data():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user["_id"] = str(user["_id"])
    return jsonify(user), 200

@auth_bp.route("/update-account", methods=["PUT"])
@jwt_required()
def update_account():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    if not any(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "No fields to update"}), 400

    update_fields = {}
    if "username" in data:
        update_fields["username"] = data["username"]
    if "email" in data:
        update_fields["email"] = data["email"]
    if "password" in data:
        update_fields["password_hash"] = hash_password(data["password"])
    if "profilePicture" in data:
        update_fields["profilePicture"] = data["profilePicture"]    

    try:
        result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to update account", "details": str(e)}), 500

    return jsonify({"message": "Account updated successfully"}), 200

@auth_bp.route("/delete-account", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to delete account", "details": str(e)}), 500

    resp = jsonify({"message": "Account deleted successfully"})
    unset_jwt_cookies(resp)
    return resp, 200

@auth_bp.route("/admin/delete-user/<string:user_id>", methods=["DELETE", "OPTIONS"])
@jwt_required()
def delete_user(user_id):
    if request.method == "OPTIONS":
        return jsonify({"ok": True}), 200

    current_user_id = get_jwt_identity()
    current_user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
    if not current_user or current_user["role"] != "superadmin":
        return jsonify({"error": "Unauthorized"}), 403

    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to delete user", "details": str(e)}), 500
    return jsonify({"message": "User deleted"}), 200

@auth_bp.route("/admin/all-users", methods=["GET"])
@jwt_required()
def get_all_users():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user or user["role"] not in ("admin", "superadmin"):
        return jsonify({"error": "Unauthorized"}), 403
    users = list(mongo.db.users.find({}, {"password_hash": 0}))
    for u in users:
        u["_id"] = str(u["_id"])
    return jsonify(users), 200

@auth_bp.route("/admin/update-user/<string:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = mongo.db.users.find_one({"_id": ObjectId(current_user_id)})
    if not current_user or current_user["role"] != "superadmin":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json() or {}
    update_fields = {}
    if "username" in data:
        update_fields["username"] = data["username"]
    if "email" in data:
        update_fields["email"] = data["email"]
    if "role" in data:
        update_fields["role"] = data["role"]
    if "password" in data:
        update_fields["password_hash"] = hash_password(data["password"])

    if not update_fields:
        return jsonify({"error": "No fields to update"}), 400

    try:
        result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to update user", "details": str(e)}), 500

    return jsonify({"message": "User updated successfully"}), 200

@auth_bp.route("/cors-test", methods=["POST", "OPTIONS"])
def cors_test():
    if request.method == "OPTIONS":
        return jsonify({"preflight": "OK"}), 200
    return jsonify({"message": "Actual POST response"}), 200
