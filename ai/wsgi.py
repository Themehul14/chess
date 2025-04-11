import os
import sys

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from web_app import app

if __name__ == "__main__":
    app.run() 