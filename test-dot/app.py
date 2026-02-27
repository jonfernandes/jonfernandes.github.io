"""Local preview server for the static Test Dot page.

This replaces the previous Flask-based entrypoint with Python's built-in
HTTP server so the UI remains pure HTML/CSS/JS.
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def run() -> None:
    root = Path(__file__).parent
    handler = lambda *args, **kwargs: SimpleHTTPRequestHandler(*args, directory=str(root), **kwargs)
    server = ThreadingHTTPServer(("0.0.0.0", 5000), handler)
    print("Serving static files from", root)
    print("Open http://127.0.0.1:5000/index.html")
    server.serve_forever()


if __name__ == "__main__":
    run()
