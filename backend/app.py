from flask import Flask
from flask_cors import CORS
from db import init_app
from routes.auth_routes import auth_bp
from routes.entry_routes import entry_bp
from routes.category_routes import category_bp
from routes.contact_routes import contact_bp
from routes.draft_routes import draft_bp
from flask_jwt_extended import JWTManager
from flask import send_from_directory

app = Flask(__name__)

# Apply CORS globally
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

# Initialize extensions
init_app(app)
app.config["JWT_SECRET_KEY"] = "your-secret-key"
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False
app.config["JWT_COOKIE_CSRF_PROTECT"] = False
jwt = JWTManager(app)

@app.route("/static/<path:filename>")
def serve_uploaded_image(filename):
    return send_from_directory("static/uploads", filename)

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(entry_bp)
app.register_blueprint(category_bp)
app.register_blueprint(contact_bp)
app.register_blueprint(draft_bp) 

if __name__ == "__main__":
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.methods} -> {rule}")
    app.run(debug=True)