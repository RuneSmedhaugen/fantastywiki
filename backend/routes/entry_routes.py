# backend/routes/entry_routes.py
from flask import Blueprint, request, jsonify
from db import mongo
from bson import ObjectId
import datetime

entry_bp = Blueprint('entry', __name__)

# Utility to convert ObjectId for JSON
def _convert_id(doc):
    doc['_id'] = str(doc['_id'])
    return doc

@entry_bp.route('/entries', methods=['GET'])
def list_entries():
    """
    Retrieve all entries from the unified index
    """
    entries = list(mongo.db.entry_index.find())
    for e in entries:
        e = _convert_id(e)
    return jsonify(entries), 200

@entry_bp.route('/entry/<entry_type>/<string:index_id>', methods=['GET'])
def get_entry(entry_type, index_id):
    """
    Retrieve a specific sub-entry by type and indexId
    """
    try:
        idx = ObjectId(index_id)
    except:
        return jsonify({'error': 'Invalid index_id'}), 400

    # Ensure the index exists
    if not mongo.db.entry_index.find_one({'_id': idx}):
        return jsonify({'error': 'Index not found'}), 404

    collection = mongo.db.get_collection(f"{entry_type}_entries")
    item = collection.find_one({'indexId': idx})
    if not item:
        return jsonify({'error': 'Entry not found'}), 404
    item = _convert_id(item)
    return jsonify(item), 200

@entry_bp.route('/entry', methods=['POST'])
def create_entry():
    """
    Create a new entry: insert into sub-collection and index
    Expected JSON: { type, title, summary, details: {...} }
    """
    data = request.get_json() or {}
    entry_type = data.get('type')
    title = data.get('title')
    summary = data.get('summary')
    details = data.get('details', {})
    creator = data.get('createdBy', 'unknown')

    if entry_type not in ['entity', 'group', 'human', 'news']:
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

    # Insert into sub-collection
    sub_doc = {'indexId': idx_res.inserted_id, **details}
    sub_col = mongo.db.get_collection(f"{entry_type}_entries")
    sub_col.insert_one(sub_doc)

    return jsonify({'message': 'Entry created', 'indexId': str(idx_res.inserted_id)}), 201

@entry_bp.route('/entry/<entry_type>/<string:index_id>', methods=['DELETE'])
def delete_entry(entry_type, index_id):
    """
    Delete entry from both index and sub-collection
    """
    try:
        idx = ObjectId(index_id)
    except:
        return jsonify({'error': 'Invalid index_id'}), 400

    # Delete sub-entry
    sub_col = mongo.db.get_collection(f"{entry_type}_entries")
    res = sub_col.delete_one({'indexId': idx})
    if res.deleted_count == 0:
        return jsonify({'error': 'Sub-entry not found'}), 404

    # Delete index
    mongo.db.entry_index.delete_one({'_id': idx})
    return jsonify({'message': 'Entry deleted'}), 200
