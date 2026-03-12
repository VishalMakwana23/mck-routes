import re

with open(r'd:\Ziing\Akshay\supabase-auth-app\src\content\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
css = css_match.group(1) if css_match else ''

# Extract JS
js_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
js = js_match.group(1) if js_match else ''

# Extract HTML Body inside split-container and dashboard-toolbar
# We will just take everything inside <body> except the script
body_match = re.search(r'<body>(.*?)<script>', content, re.DOTALL)
html_body = body_match.group(1) if body_match else ''

# Convert HTML to JSX
jsx = html_body.replace('class=', 'className=').replace('onclick=', 'onClick=').replace('onchange=', 'onChange=').replace('style="', 'style="')
# basic inline style fix for JSX (just taking out inline styles is safer, or manually fixing them)
# There are few inline styles. Let's find and remove them or convert them.
# Examples: style="width: 24px;" -> style={{ width: '24px' }}
def style_replacer(match):
    style_str = match.group(1)
    parts = [p.strip() for p in style_str.split(';') if p.strip()]
    out = []
    for p in parts:
        if ':' not in p: continue
        k, v = p.split(':', 1)
        k = k.strip()
        v = v.strip().replace("'", '"')
        # camelCase conversion for CSS properties
        k = re.sub(r'-([a-z])', lambda x: x.group(1).upper(), k)
        out.append(f"{k}: '{v}'")
    return "style={{" + ", ".join(out) + "}}"

jsx = re.sub(r'style="(.*?)"', style_replacer, jsx)

# Remove HTML comments
jsx = re.sub(r'<!--(.*?)-->', '', jsx, flags=re.DOTALL)

# Add Leaflet globally if we can't do it in script
# Let's save the parts
with open(r'd:\Ziing\Akshay\supabase-auth-app\src\pages\DashboardStyles.css', 'w', encoding='utf-8') as f:
    f.write(css)

with open(r'd:\Ziing\Akshay\supabase-auth-app\src\pages\dashboardLogic.js', 'w', encoding='utf-8') as f:
    f.write("export function initDashboardMap() {\n")
    f.write(js)
    f.write("\n}")

with open(r'd:\Ziing\Akshay\supabase-auth-app\src\pages\DashboardJSX.txt', 'w', encoding='utf-8') as f:
    f.write(jsx)

print("Extraction complete.")
