from flask import Blueprint, jsonify
from db import mongo

category_bp = Blueprint("category", __name__)

@category_bp.route("/categories", methods=["GET"])
def get_categories():
    categories = list(mongo.db.categories.find({}, {"_id": 0}))
    return jsonify(categories)
