import os
import re

def bundle_files():
    base_dir = '/Users/juanchacon/Desktop/4Labs Website'
    template_path = os.path.join(base_dir, 'index_template.html')
    output_path = os.path.join(base_dir, 'index.html')
    
    if not os.path.exists(template_path):
        print(f"Error: Template file not found at {template_path}")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Inline CSS
    def replace_css(match):
        css_file = match.group(1)
        css_path = os.path.join(base_dir, css_file)
        if os.path.exists(css_path):
            with open(css_path, 'r', encoding='utf-8') as f:
                css_content = f.read()
            return f'<style>\n{css_content}\n</style>'
        else:
            print(f"Warning: CSS file {css_file} not found.")
            return match.group(0)

    # Regex to find <link rel="stylesheet" href="...">
    html_content = re.sub(r'<link\s+rel=["\']stylesheet["\']\s+href=["\']([^"\']+)["\']\s*>', replace_css, html_content)

    # Inline JS
    def replace_js(match):
        js_file = match.group(1)
        # Skip external scripts (starting with http or //)
        if js_file.startswith('http') or js_file.startswith('//'):
            return match.group(0)
            
        js_path = os.path.join(base_dir, js_file)
        if os.path.exists(js_path):
            with open(js_path, 'r', encoding='utf-8') as f:
                js_content = f.read()
            return f'<script>\n{js_content}\n</script>'
        else:
            print(f"Warning: JS file {js_file} not found.")
            return match.group(0)

    # Regex to find <script src="..."></script>
    html_content = re.sub(r'<script\s+src=["\']([^"\']+)["\']\s*>\s*</script>', replace_js, html_content)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"Successfully bundled to {output_path}")

if __name__ == "__main__":
    bundle_files()
