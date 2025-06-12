from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

contact_bp = Blueprint("contact", __name__)

def get_db():
    from db import mongo
    return mongo.db

# Create a new ticket
@contact_bp.route("/tickets", methods=["POST"])
@jwt_required()
def create_ticket():
    data = request.json
    user_id = get_jwt_identity()
    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc:
        return jsonify({"error": "User not found"}), 404
    ticket = {
        "title": data.get("title"),
        "summary": data.get("summary"),
        "createdBy": {"id": user_doc["_id"], "username": user_doc["username"]},
        "createdAt": datetime.utcnow(),
        "status": "open",
        "messages": [
            {
                "sender": {
                    "id": user_doc["_id"],
                    "username": user_doc["username"],
                    "role": user_doc.get("role", "user")
                },
                "content": data.get("message"),
                "createdAt": datetime.utcnow()
            }
        ]
    }
    result = db.tickets.insert_one(ticket)
    return jsonify({"success": True, "ticketId": str(result.inserted_id)}), 201

# List all tickets (admin only)
@contact_bp.route("/tickets", methods=["GET"])
@jwt_required()
def list_tickets():
    user_id = get_jwt_identity()
    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc or user_doc.get("role") not in ["admin", "superadmin"]:
        return jsonify({"error": "Unauthorized"}), 403
    tickets = list(db.tickets.find({}, {"messages": 0}))
    for t in tickets:
        t["_id"] = str(t["_id"])
        t["createdBy"]["id"] = str(t["createdBy"]["id"])
    return jsonify(tickets)

# Get a ticket and its messages
@contact_bp.route("/tickets/<ticket_id>", methods=["GET"])
@jwt_required()
def get_ticket(ticket_id):
    user_id = get_jwt_identity()
    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    ticket = db.tickets.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        return jsonify({"error": "Not found"}), 404
    # Only creator or admin can view
    if user_doc.get("role") not in ["admin", "superadmin"] and str(ticket["createdBy"]["id"]) != str(user_doc["_id"]):
        return jsonify({"error": "Unauthorized"}), 403
    ticket["_id"] = str(ticket["_id"])
    ticket["createdBy"]["id"] = str(ticket["createdBy"]["id"])
    for msg in ticket["messages"]:
        msg["sender"]["id"] = str(msg["sender"]["id"])
    return jsonify(ticket)

# Reply to a ticket
@contact_bp.route("/tickets/<ticket_id>/reply", methods=["POST"])
@jwt_required()
def reply_ticket(ticket_id):
    user_id = get_jwt_identity()
    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    data = request.json
    ticket = db.tickets.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        return jsonify({"error": "Not found"}), 404
    # Only creator or admin can reply
    if user_doc.get("role") not in ["admin", "superadmin"] and str(ticket["createdBy"]["id"]) != str(user_doc["_id"]):
        return jsonify({"error": "Unauthorized"}), 403
    msg = {
        "sender": {
            "id": user_doc["_id"],
            "username": user_doc["username"],
            "role": user_doc.get("role", "user")
        },
        "content": data.get("message"),
        "createdAt": datetime.utcnow()
    }
    db.tickets.update_one({"_id": ObjectId(ticket_id)}, {"$push": {"messages": msg}})
    return jsonify({"success": True})

# Delete a ticket (admin only)
@contact_bp.route("/tickets/<ticket_id>", methods=["DELETE"])
@jwt_required()
def delete_ticket(ticket_id):
    user_id = get_jwt_identity()
    db = get_db()
    user_doc = db.users.find_one({"_id": ObjectId(user_id)})
    if not user_doc or user_doc.get("role") not in ["admin", "superadmin"]:
        return jsonify({"error": "Unauthorized"}), 403
    db.tickets.delete_one({"_id": ObjectId(ticket_id)})
    return jsonify({"success": True})