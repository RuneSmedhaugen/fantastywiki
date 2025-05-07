from flask import Blueprint, jsonify
from pymongo import MongoClient

entities_bp = Blueprint("entities", __name__)
client = MongoClient("mongodb://localhost:27017")
db = client["fantasy_wiki"]
collection = db["entities"]

@entities_bp.route("/", methods=["GET"])
def get_entities():
    entities = list(collection.find({}, {"_id": 0}))
    return jsonify(entities)
