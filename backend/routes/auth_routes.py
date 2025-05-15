from flask import Blueprint, request, jsonify
from db import mongo
from auth import make_user_doc, verify_password, hash_password
from bson import ObjectId
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies
)
from datetime import timedelta

# Initialize blueprint
auth_bp = Blueprint("auth", __name__)

# Register user
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    # Basic validation
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Missing fields"}), 400

    user_doc = make_user_doc(data["username"], data["email"], data["password"])
    try:
        res = mongo.db.users.insert_one(user_doc)
    except Exception:
        return jsonify({"error": "Username or email already exists"}), 409

    return jsonify({"message": "User created", "id": str(res.inserted_id)}), 201

# Update user account
@auth_bp.route("/update-account", methods=["PUT"])
@jwt_required()
def update_account():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    # Validate input
    if not any(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "No fields to update"}), 400

    update_fields = {}
    if "username" in data:
        update_fields["username"] = data["username"]
    if "email" in data:
        update_fields["email"] = data["email"]
    if "password" in data:
        update_fields["password_hash"] = hash_password(data["password"])

    try:
        result = mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_fields})
        if result.matched_count == 0:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "Failed to update account", "details": str(e)}), 500

    return jsonify({"message": "Account updated successfully"}), 200

# Delete user account
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

    # Clear JWT cookies after account deletion
    resp = jsonify({"message": "Account deleted successfully"})
    unset_jwt_cookies(resp)
    return resp, 200

# Login user and set JWT in cookie
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    user = mongo.db.users.find_one({"username": data.get("username")})
    if not user or not verify_password(user.get("password_hash", ""), data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    # Create JWT token
    access_token = create_access_token(
        identity=str(user["_id"]),
        expires_delta=timedelta(hours=8)
    )
    # Prepare response with cookie
    resp = jsonify({
        "username": user["username"],
        "email":    user["email"],
        "role":     user["role"]
    })
    set_access_cookies(resp, access_token)
    return resp, 200

# Logout user by clearing JWT cookies
@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    resp = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(resp)
    return resp, 200

# Protected user profile route
@auth_bp.route("/profile-data", methods=["GET"])
@jwt_required()
def profile_data():
    user_id = get_jwt_identity()
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)}, {"password_hash": 0})
    if not user:
        return jsonify({"error": "User not found"}), 404
    user["_id"] = str(user["_id"])
    return jsonify(user), 200
