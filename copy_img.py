import shutil
import os

source = "/Users/juanchacon/.gemini/antigravity/brain/fbf11c67-1ae4-4244-af13-e758071deea4/uploaded_media_1769823956609.png"
dest = "/Users/juanchacon/Desktop/4Labs Website/assets/images/robot_greeting.png"

try:
    shutil.copy2(source, dest)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
