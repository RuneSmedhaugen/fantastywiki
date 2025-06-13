from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

draft_bp = Blueprint("drafts", __name__)

def get_db():
    from db import mongo
    return mongo.db

# Autosave or update a draft
@draft_bp.route("/drafts", methods=["POST"])
@jwt_required()
def save_draft():
    data = request.json
    user_id = get_jwt_identity()
    db = get_db()
    draft_id = data.get("_id")
    draft_data = {
        "title": data.get("title", ""),
        "summary": data.get("summary", ""),
        "content": data.get("content", ""),
        "details": data.get("details", {}),
        "sections": data.get("sections", []),
        "imageUrl": data.get("imageUrl", ""),
        "authorId": ObjectId(user_id),
        "updatedAt": datetime.utcnow(),
        "status": "draft",
    }
    if draft_id:
        db.drafts.update_one(
            {"_id": ObjectId(draft_id), "authorId": ObjectId(user_id)},
            {"$set": draft_data},
            upsert=True
        )
        return jsonify({"success": True, "draftId": draft_id})
    else:
        draft_data["createdAt"] = datetime.utcnow()
        result = db.drafts.insert_one(draft_data)
        return jsonify({"success": True, "draftId": str(result.inserted_id)})

# Get all drafts for the current user
@draft_bp.route("/drafts/mine", methods=["GET"])
@jwt_required()
def my_drafts():
    user_id = get_jwt_identity()
    db = get_db()
    drafts = list(db.drafts.find({"authorId": ObjectId(user_id)}))
    for d in drafts:
        d["_id"] = str(d["_id"])
        d["authorId"] = str(d["authorId"])
    return jsonify(drafts)

# Get a specific draft
@draft_bp.route("/drafts/<draft_id>", methods=["GET"])
@jwt_required()
def get_draft(draft_id):
    user_id = get_jwt_identity()
    db = get_db()
    draft = db.drafts.find_one({"_id": ObjectId(draft_id), "authorId": ObjectId(user_id)})
    if not draft:
        return jsonify({"error": "Draft not found"}), 404
    draft["_id"] = str(draft["_id"])
    draft["authorId"] = str(draft["authorId"])
    return jsonify(draft)

# Delete a draft
@draft_bp.route("/drafts/<draft_id>", methods=["DELETE"])
@jwt_required()
def delete_draft(draft_id):
    user_id = get_jwt_identity()
    db = get_db()
    result = db.drafts.delete_one({"_id": ObjectId(draft_id), "authorId": ObjectId(user_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Draft not found"}), 404
    return jsonify({"success": True})

# Admin: Get all drafts
@draft_bp.route("/drafts", methods=["GET"])
@jwt_required()
def all_drafts():
    user_id = get_jwt_identity()
    db = get_db()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user or user.get("role") not in ["admin", "superadmin"]:
        return jsonify({"error": "Unauthorized"}), 403
    drafts = list(db.drafts.find())
    for d in drafts:
        d["_id"] = str(d["_id"])
        d["authorId"] = str(d["authorId"])
    return jsonify(drafts)