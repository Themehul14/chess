import os
import sys

# Add the project directory to the Python path
project_home = os.path.expanduser('~/Heckathon')
if project_home not in sys.path:
    sys.path.append(project_home)

# Import your Flask app
from ai.web_app import app as application  # PythonAnywhere looks for the 'application' variable 