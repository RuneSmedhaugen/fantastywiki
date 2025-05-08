from db import init_app, mongo
from flask import Flask

app = Flask(__name__)
init_app(app)

with app.app_context():
    categories = [
        "people",
        "echoes",
        "groups",
        "organizations",
        "planets",
        "locations",
        "artifacts",
        "events",
        "species",
        "dimensions"
    ]

    for name in categories:
        if not mongo.db.categories.find_one({"name": name}):
            mongo.db.categories.insert_one({"name": name})
            print(f"Inserted category: {name}")
        else:
            print(f"Category already exists: {name}")
