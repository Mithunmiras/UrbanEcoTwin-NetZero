import os, glob

replacements = [
    ("background: '#1e293b'", "background: '#ffffff'"),
    ("border: '1px solid rgba(255,255,255,0.1)'", "border: '1px solid rgba(0,0,0,0.1)'"),
    ("color: '#f1f5f9'", "color: '#0f172a'"),
    ("color: '#fff'", "color: '#0f172a'"),
    ("rgba(255,255,255,0.05)", "rgba(0,0,0,0.05)"),
    ("rgba(255,255,255,0.1)", "rgba(0,0,0,0.1)"),
    ("rgba(255,255,255,0.2)", "rgba(0,0,0,0.2)"),
    ("rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)"),
    ("rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)"),
    ("border-bottom: 1px solid rgba(255, 255, 255, 0.03)", "border-bottom: 1px solid rgba(0, 0, 0, 0.05)"),
    ("border-color: rgba(255, 255, 255, 0.12)", "border-color: rgba(0, 0, 0, 0.12)"),
    ("backgroundColor: Cesium.Color.fromCssColorString('#0a0f1a').withAlpha(0.8)", "backgroundColor: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.85)"),
    ("background: 'rgba(10, 15, 26, 0.92)'", "background: 'rgba(255, 255, 255, 0.92)'"),
    ("Cesium.Color.fromCssColorString('#0a0f1a')", "Cesium.Color.fromCssColorString('#f8fafc')"),
    ("color: '#e2e8f0'", "color: '#475569'"),
    ("stroke=\"rgba(255,255,255,0.05)\"", "stroke=\"rgba(0,0,0,0.05)\"")
]

for filepath in glob.glob('frontend/src/**/*.jsx', recursive=True) + glob.glob('frontend/src/**/*.css', recursive=True):
    with open(filepath, 'r') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements:
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
