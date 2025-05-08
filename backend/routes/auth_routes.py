from flask import Blueprint, request, jsonify
from db import mongo
from auth import make_user_doc, verify_password
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
