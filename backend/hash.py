from werkzeug.security import generate_password_hash

# Replace 'yourpassword' with your desired password
hashed = generate_password_hash('asd')
print(hashed)