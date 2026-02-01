
import shutil
import os

source = '/Users/juanchacon/.gemini/antigravity/brain/fbf11c67-1ae4-4244-af13-e758071deea4/logo_transparent_1769826451330.png'
destination = '/Users/juanchacon/Desktop/4Labs Website/assets/images/logo_transparent.png'

try:
    shutil.copy2(source, destination)
    print(f"Successfully copied to {destination}")
except Exception as e:
    print(f"Error copying file: {e}")
