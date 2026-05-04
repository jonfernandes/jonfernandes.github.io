#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler


class Handler(SimpleHTTPRequestHandler):
    """Serve static files from this directory for local preview."""


if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 5000), Handler)
    print('Serving static files at http://0.0.0.0:5000')
    server.serve_forever()
