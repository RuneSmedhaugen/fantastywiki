from flask import Blueprint, request, jsonify
from db import mongo
from auth import make_user_doc, verify_password
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    # Basic validation
    if not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Missing fields"}), 400

    user_doc = make_user_doc(data["username"], data["email"], data["password"])
    try:
        res = mongo.db.users.insert_one(user_doc)
    except Exception as e:
        return jsonify({"error": "Username or email already exists"}), 409

    return jsonify({"message": "User created", "id": str(res.inserted_id)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = mongo.db.users.find_one({"username": data.get("username")})
    if not user or not verify_password(user["password_hash"], data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401

    # will generate a JWT token here in the future
    # For now, just return user info
    return jsonify({
        "username": user["username"],
        "email":    user["email"],
        "role":     user["role"],
        "id":       str(user["_id"])
    })
