from flask import Flask
from flask_cors import CORS
from db import init_app, mongo
from routes.auth_routes import auth_bp
from routes.entry_routes import entry_bp
from routes.category_routes import category_bp
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)
init_app(app)

app.register_blueprint(auth_bp)
app.register_blueprint(entry_bp)
app.register_blueprint(category_bp)
app.config["JWT_SECRET_KEY"] = "your-secret-key"
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_SECURE"] = False   # set True in production with HTTPS
app.config["JWT_COOKIE_CSRF_PROTECT"] = False  # enable if you want CSRF protection
jwt = JWTManager(app)

if __name__ == "__main__":
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.methods} -> {rule}")
    app.run(debug=True)

