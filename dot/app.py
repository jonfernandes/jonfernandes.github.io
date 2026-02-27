from flask import Flask, send_from_directory

# Local development entrypoint only.
# GitHub Pages cannot execute Flask/Python apps; it can only serve static files.
# Deploy index.html (and related static assets) to Pages instead.
app = Flask(__name__, static_folder='.', static_url_path='')


@app.route('/')
def index():
    return send_from_directory('.', 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
