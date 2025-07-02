from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='.') # Serve static files from the current directory

@app.route('/')
def index():
    """Serves the main HTML file."""
    return send_from_directory('.', 'index.html')

@app.route('/<path:filename>')
def static_files(filename):
    """Serves other static files like CSS and JS."""
    return send_from_directory('.', filename)

if __name__ == '__main__':
    # Run the Flask app
    # In a production environment, you would use a more robust WSGI server like Gunicorn
    app.run(debug=True) # debug=True enables auto-reloading and better error messages
