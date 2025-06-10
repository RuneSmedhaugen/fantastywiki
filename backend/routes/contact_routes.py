from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

contact_bp = Blueprint("contact", __name__)

def get_db():
    from app import mongo
    return mongo.db

# Create a new ticket
@contact_bp.route("/tickets", methods=["POST"])
@jwt_required()
def create_ticket():
    data = request.json
    user = get_jwt_identity()
    ticket = {
        "title": data.get("title"),
        "summary": data.get("summary"),
        "createdBy": {"id": ObjectId(user["_id"]), "username": user["username"]},
        "createdAt": datetime.utcnow(),
        "status": "open",
        "messages": [
            {
                "sender": {"id": ObjectId(user["_id"]), "username": user["username"], "role": user.get("role", "user")},
                "content": data.get("message"),
                "createdAt": datetime.utcnow()
            }
        ]
    }
    result = get_db().tickets.insert_one(ticket)
    return jsonify({"success": True, "ticketId": str(result.inserted_id)}), 201

# List all tickets (admin only)
@contact_bp.route("/tickets", methods=["GET"])
@jwt_required()
def list_tickets():
    user = get_jwt_identity()
    if user.get("role") not in ["admin", "superadmin"]:
        return jsonify({"error": "Unauthorized"}), 403
    tickets = list(get_db().tickets.find({}, {"messages": 0}))
    for t in tickets:
        t["_id"] = str(t["_id"])
        t["createdBy"]["id"] = str(t["createdBy"]["id"])
    return jsonify(tickets)

# Get a ticket and its messages
@contact_bp.route("/tickets/<ticket_id>", methods=["GET"])
@jwt_required()
def get_ticket(ticket_id):
    user = get_jwt_identity()
    ticket = get_db().tickets.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        return jsonify({"error": "Not found"}), 404
    # Only creator or admin can view
    if user.get("role") not in ["admin", "superadmin"] and str(ticket["createdBy"]["id"]) != user["_id"]:
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
    user = get_jwt_identity()
    data = request.json
    ticket = get_db().tickets.find_one({"_id": ObjectId(ticket_id)})
    if not ticket:
        return jsonify({"error": "Not found"}), 404
    # Only creator or admin can reply
    if user.get("role") not in ["admin", "superadmin"] and str(ticket["createdBy"]["id"]) != user["_id"]:
        return jsonify({"error": "Unauthorized"}), 403
    msg = {
        "sender": {"id": ObjectId(user["_id"]), "username": user["username"], "role": user.get("role", "user")},
        "content": data.get("message"),
        "createdAt": datetime.utcnow()
    }
    get_db().tickets.update_one({"_id": ObjectId(ticket_id)}, {"$push": {"messages": msg}})
    return jsonify({"success": True})

# Delete a ticket (admin only)
@contact_bp.route("/tickets/<ticket_id>", methods=["DELETE"])
@jwt_required()
def delete_ticket(ticket_id):
    user = get_jwt_identity()
    if user.get("role") not in ["admin", "superadmin"]:
        return jsonify({"error": "Unauthorized"}), 403
    get_db().tickets.delete_one({"_id": ObjectId(ticket_id)})
    return jsonify({"success": True})