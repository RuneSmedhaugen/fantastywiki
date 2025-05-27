from flask import Blueprint, request, jsonify
from db import mongo
from bson import ObjectId
import datetime
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
import uuid
import os

entry_bp = Blueprint('entry', __name__)

# Utility to convert ObjectId for JSON
def _convert_id(doc):
    doc['_id'] = str(doc['_id'])
    return doc

VALID_TYPES = [
    'entity', 'group', 'human', 'news',
    'organization', 'planet', 'location',
    'artifact', 'event', 'species', 'dimension'
]

@entry_bp.route('/entries', methods=['GET'])
def list_entries():
    """
    Retrieve all entries from the unified index
    """
    entries = list(mongo.db.entry_index.find())
    entries = [_convert_id(e) for e in entries]
    return jsonify(entries), 200

@entry_bp.route('/entry/<entry_type>/<string:index_id>', methods=['GET'])
def get_entry(entry_type, index_id):
    """
    Retrieve a specific sub-entry by type and indexId, merging index data.
    """
    if entry_type not in VALID_TYPES:
        return jsonify({'error': 'Invalid entry type'}), 400

    try:
        idx = ObjectId(index_id)
    except:
        return jsonify({'error': 'Invalid index_id'}), 400

    # Fetch the index document
    index_doc = mongo.db.entry_index.find_one({'_id': idx})
    if not index_doc:
        return jsonify({'error': 'Index not found'}), 404

    # Determine collection name
    col_name = f"{entry_type}_entries"
    if col_name not in mongo.db.list_collection_names():
        col_name = entry_type  # fallback
    collection = mongo.db.get_collection(col_name)

    # Fetch the sub-entry document
    sub_entry = collection.find_one({'indexId': idx})
    if not sub_entry:
        return jsonify({'error': 'Entry not found'}), 404

    # Merge index data with sub-entry data
    sub_entry = _convert_id(sub_entry)
    sub_entry.update({
        'title': index_doc.get('title'),
        'summary': index_doc.get('summary'),
        'createdBy': index_doc.get('createdBy'),
        'createdAt': index_doc.get('createdAt'),
    })

    return jsonify(sub_entry), 200

@entry_bp.route('/entry', methods=['POST'])
def create_entry():
    data = request.get_json() or {}
    entry_type = data.get('type')
    title = data.get('title')
    summary = data.get('summary')
    details = data.get('details', {})
    creator = data.get('createdBy', 'unknown')
    image_url = data.get('imageUrl', '')  # <-- ADD THIS LINE

    if entry_type not in VALID_TYPES:
        return jsonify({'error': 'Invalid entry type'}), 400
    if not title or not summary:
        return jsonify({'error': 'Missing title or summary'}), 400

    # Insert into index
    idx_doc = {
        'title': title,
        'type': entry_type,
        'summary': summary,
        'createdBy': creator,
        'createdAt': datetime.datetime.utcnow()
    }
    idx_res = mongo.db.entry_index.insert_one(idx_doc)

    # Determine sub-collection name
    col_name = f"{entry_type}_entries"
    if col_name not in mongo.db.list_collection_names():
        col_name = entry_type
    sub_col = mongo.db.get_collection(col_name)

    # Insert into sub-collection
    sub_doc = {
        'indexId': idx_res.inserted_id,
        'details': details,
        'sections': data.get('sections', []),
        'imageUrl': image_url  # <-- ADD THIS LINE
    }
    sub_col.insert_one(sub_doc)

    return jsonify({'message': 'Entry created', 'indexId': str(idx_res.inserted_id)}), 201


@entry_bp.route('/entry/<entry_type>/<string:index_id>', methods=['DELETE'])
def delete_entry(entry_type, index_id):
    """
    Delete entry from both index and sub-collection
    """
    if entry_type not in VALID_TYPES:
        return jsonify({'error': 'Invalid entry type'}), 400

    try:
        idx = ObjectId(index_id)
    except:
        return jsonify({'error': 'Invalid index_id'}), 400

    # Determine sub-collection name
    col_name = f"{entry_type}_entries"
    if col_name not in mongo.db.list_collection_names():
        col_name = entry_type
    sub_col = mongo.db.get_collection(col_name)

    # Delete sub-entry
    res = sub_col.delete_one({'indexId': idx})
    if res.deleted_count == 0:
        return jsonify({'error': 'Sub-entry not found'}), 404

    # Delete index
    mongo.db.entry_index.delete_one({'_id': idx})
    return jsonify({'message': 'Entry deleted'}), 200

@entry_bp.route('/search', methods=['GET'])
def search_entries():
    """
    Search entries by title or summary (case-insensitive, partial match)
    """
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])

    # Simple text search on title and summary
    search_filter = {
        "$or": [
            {"title": {"$regex": query, "$options": "i"}},
            {"summary": {"$regex": query, "$options": "i"}}
        ]
    }
    results = list(mongo.db.entry_index.find(search_filter))
    results = [_convert_id(e) for e in results]
    return jsonify(results), 200

@entry_bp.route('/entry/<entry_type>/<string:index_id>', methods=['PUT'])
def edit_entry(entry_type, index_id):
    if entry_type not in VALID_TYPES:
        return jsonify({'error': 'Invalid entry type'}), 400

    try:
        idx = ObjectId(index_id)
    except:
        return jsonify({'error': 'Invalid index_id'}), 400

    data = request.get_json() or {}
    title = data.get('title')
    summary = data.get('summary')
    details = data.get('details', {})
    sections = data.get('sections', [])
    image_url = data.get('imageUrl')  # <-- ADD THIS LINE

    # Update index document
    index_update = {}
    if title is not None:
        index_update['title'] = title
    if summary is not None:
        index_update['summary'] = summary
    if index_update:
        mongo.db.entry_index.update_one({'_id': idx}, {'$set': index_update})

    # Update sub-collection document
    col_name = f"{entry_type}_entries"
    if col_name not in mongo.db.list_collection_names():
        col_name = entry_type
    sub_col = mongo.db.get_collection(col_name)

    sub_update = {}
    if details is not None:
        sub_update['details'] = details
    sub_update['sections'] = sections
    if image_url is not None:  # <-- ADD THIS CHECK
        sub_update['imageUrl'] = image_url

    res = sub_col.update_one({'indexId': idx}, {'$set': sub_update})
    if res.matched_count == 0:
        return jsonify({'error': 'Entry not found'}), 404

    return jsonify({'message': 'Entry updated'}), 200


UPLOAD_FOLDER = "static/uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@entry_bp.route("/entry/upload-image/<entry_type>/<string:index_id>", methods=["POST"])
@jwt_required()
def upload_entry_image(entry_type, index_id):
    if entry_type not in VALID_TYPES:
        return jsonify({"error": "Invalid entry type"}), 400

    try:
        obj_id = ObjectId(index_id)
    except:
        return jsonify({"error": "Invalid index_id"}), 400

    if "image" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # Ensure unique filename
        if os.path.exists(filepath):
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{uuid.uuid4().hex}{ext}"
            filepath = os.path.join(UPLOAD_FOLDER, filename)

        file.save(filepath)

        # Generate web URL for image
        image_url = os.path.join("static", "uploads", filename).replace("\\", "/")
        image_url = "/" + image_url.lstrip("/")

        # Determine sub-collection
        col_name = f"{entry_type}_entries"
        if col_name not in mongo.db.list_collection_names():
            col_name = entry_type
        collection = mongo.db.get_collection(col_name)

        # Update the entry with the image URL
        result = collection.update_one(
            {"indexId": obj_id},
            {"$set": {"imageUrl": image_url}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Entry not found"}), 404

        return jsonify({"message": "Image uploaded", "imageUrl": image_url}), 200


        return jsonify({"error": "Invalid file type"}), 400