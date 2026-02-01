from PIL import Image
import numpy as np
import sys

# Paths
source_path = "input.png"
dest_path = "output_clean.png"

try:
    # 1. Load image
    img = Image.open(source_path).convert("RGBA")
    data = np.array(img)

    # 2. Define Thresholds
    # Anything below 'low' is transparent
    # Anything above 'high' is opaque
    # Between is smoothed
    low_threshold = 10
    high_threshold = 40

    # 3. Calculate brightness (Max of R, G, B)
    # Using max allows any color (even dark blue) to contribute to opacity
    rgb = data[:,:,:3]
    brightness = np.max(rgb, axis=2)

    # 4. Create Alpha Mask
    alpha = np.zeros_like(brightness, dtype=np.uint8)
    
    # Smooth transition
    mask_smooth = (brightness >= low_threshold) & (brightness <= high_threshold)
    alpha[mask_smooth] = ((brightness[mask_smooth] - low_threshold) / (high_threshold - low_threshold) * 255).astype(np.uint8)
    
    # Opaque
    alpha[brightness > high_threshold] = 255
    
    # 5. Apply Alpha
    data[:,:,3] = alpha

    # 6. Save
    result = Image.fromarray(data)
    result.save(dest_path, "PNG")
    print("Successfully processed image.")

except Exception as e:
    print(f"Error: {e}")
