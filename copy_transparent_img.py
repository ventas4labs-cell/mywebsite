import shutil
import os

source = "/Users/juanchacon/.gemini/antigravity/brain/fbf11c67-1ae4-4244-af13-e758071deea4/robot_transparent_1769824161486.png"
dest = "/Users/juanchacon/Desktop/4Labs Website/assets/images/robot_greeting.png"

try:
    shutil.copy2(source, dest)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
