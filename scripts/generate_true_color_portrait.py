import os
from PIL import Image

input_path = "/Users/sha/Sha portfolio/sha-portfolio/public/SHA.jpg"
output_svg_path = "/Users/sha/Sha portfolio/sha-portfolio/public/images/sha_matrix.svg"

# 1. Load image and keep transparency (RGBA is crucial)
img = Image.open(input_path).convert("RGBA")
w, h = img.size

# Crop centered upper body / face portrait
crop_box = (0, int(h * 0.05), w, int(h * 0.85))
img_cropped = img.crop(crop_box)

# Grid dimensions
grid_cols = 75
cw, ch = img_cropped.size
grid_rows = int(grid_cols * (ch / cw))

# Resize the RGBA image directly. NO Grayscale, NO ImageOps.
img_small = img_cropped.resize((grid_cols, grid_rows), Image.Resampling.LANCZOS)

spacing = 10
margin = 20
width_svg = grid_cols * spacing + margin * 2
height_svg = grid_rows * spacing + margin * 2

css_lines = [
    "@keyframes rv { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }",
    ".rw { animation: rv 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: center; }"
]

max_delay = 2.5
for r in range(grid_rows):
    delay = (r / grid_rows) * max_delay
    css_lines.append(f".r{r} {{ animation-delay: {delay:.3f}s; }}")

svg_content = [
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width_svg} {height_svg}" width="{width_svg}" height="{height_svg}" role="img" aria-label="dot-matrix portrait">',
    '<style>' + "".join(css_lines) + '</style>',
    f'<g transform="translate({margin}, {margin})">'
]

for r in range(grid_rows):
    svg_content.append(f'<g class="rw r{r}">')
    for c in range(grid_cols):
        # Get True Color and Alpha
        r_px, g_px, b_px, a_px = img_small.getpixel((c, r))

        # Skip transparent background
        if a_px < 50:
            continue

        # Calculate Luminance (0 = Black, 255 = White)
        luminance = (0.299 * r_px) + (0.587 * g_px) + (0.114 * b_px)

        # LIGHT MODE MATH: Invert luminance so dark colors make BIG dots
        intensity = (255.0 - luminance) / 255.0

        # Radius calculation: minimum 0.8, maximum 4.8
        radius = round(0.8 + (intensity * 4.0), 2)

        cx = c * spacing + spacing / 2
        cy = r * spacing + spacing / 2
        hex_color = f"#{r_px:02x}{g_px:02x}{b_px:02x}"

        svg_content.append(f'<circle cx="{cx}" cy="{cy}" r="{radius}" fill="{hex_color}" />')
    svg_content.append('</g>')

svg_content.append('</g>')
svg_content.append('</svg>')

os.makedirs(os.path.dirname(output_svg_path), exist_ok=True)

with open(output_svg_path, "w") as f:
    f.write("\n".join(svg_content))

print("Successfully generated light mode matrix portrait!")
