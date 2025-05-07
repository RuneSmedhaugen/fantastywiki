from flask import Flask
from flask_cors import CORS
from db import init_app, mongo
from routes.auth_routes import auth_bp
from routes.entry_routes import entry_bp
from routes.category_routes import category_bp

app = Flask(__name__)
CORS(app)
init_app(app)

app.register_blueprint(auth_bp,  url_prefix="/api/auth")
app.register_blueprint(entry_bp, url_prefix="/api/entries")
app.register_blueprint(category_bp, url_prefix="/api/categories")

if __name__ == "__main__":
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.methods} -> {rule}")
    app.run(debug=True)

