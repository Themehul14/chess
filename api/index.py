import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the Flask app
from ai.web_app import app

# Handler for Vercel
if __name__ == '__main__':
    app.run() 