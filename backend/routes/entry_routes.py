from flask import Blueprint, request, jsonify
from db import mongo
from bson import ObjectId
from datetime import datetime

entry_bp = Blueprint("entries", __name__)

@entry_bp.route("/", methods=["GET"])
def list_entries():
    docs = mongo.db.entries.find()
    out  = []
    for d in docs:
        d["_id"] = str(d["_id"])
        out.append(d)
    return jsonify(out)

@entry_bp.route("/", methods=["POST"])
def create_entry():
    data = request.get_json()
    # Expected: title, slug, body, created_by (user_id), tags
    doc = {
        "title":      data["title"],
        "slug":       data["slug"],
        "body":       data["body"],
        "created_by": ObjectId(data["created_by"]),
        "created_at": datetime.utcnow(),
        "tags":       data.get("tags", [])
    }
    res = mongo.db.entries.insert_one(doc)
    return jsonify({"id": str(res.inserted_id)}), 201
