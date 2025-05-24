#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('X-Frame-Options', 'ALLOWALL')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 12000
    
    # Change to the directory containing the HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("0.0.0.0", port), CORSHTTPRequestHandler) as httpd:
        print(f"Serving at http://0.0.0.0:{port}")
        print(f"Access the app at: https://work-1-zgyduezgntgwvkwe.prod-runtime.all-hands.dev" if port == 12000 else f"https://work-2-zgyduezgntgwvkwe.prod-runtime.all-hands.dev")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    main()