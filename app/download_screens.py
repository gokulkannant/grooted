import json
import urllib.request
import os

os.makedirs('stitch_screens', exist_ok=True)

# Parse Design Systems
with open(r'C:\Users\gokul\.gemini\antigravity\brain\ea16465f-e4f2-4a03-922b-8bafd114e864\.system_generated\steps\16\output.txt', 'r', encoding='utf-8') as f:
    ds_data = json.load(f)

for ds in ds_data.get('designSystems', []):
    name = ds.get('name', '')
    if '5e942cb4fcc14d9d90a6aef877d814a8' in name:
        with open('stitch_screens/1_Design_System_1.md', 'w', encoding='utf-8') as f:
            f.write(ds.get('designSystem', {}).get('designMd', ''))
    elif 'c5b79a7688cc41d486154f9077e140d8' in name:
        with open('stitch_screens/2_Design_System_2.md', 'w', encoding='utf-8') as f:
            f.write(ds.get('designSystem', {}).get('designMd', ''))

# Parse Screens
target_ids = {
    '8058648619f64977bbae5db2869aba74': '3_Home_Voxel_Edition',
    'ca1797c1eebc473f8eb4dc128e64683e': '4_Home_High_Fidelity_Voxel',
    '3ca593d8c2f8443ea55766bb9e1c2848': '5_Map_High_Fidelity_Voxel',
    '3eaed4e3cbed47fca28a934337f7f85a': '6_Map_Voxel_Edition',
    '779cacbef83943e6b420111b1144081a': '7_Home_High_Fidelity_Voxel_Polished',
    '51a0a204f67f428a87fc1db4dee08f66': '8_Health_High_Fidelity_Voxel',
    'f16a0adae2e74f889383cd487579a83e': '9_Health_Result_Voxel_Edition',
    'a0dcfa3cfcb44049a8bf7919bbb10700': '10_Add_Plant_High_Fidelity_Voxel',
    '1eb2f2d317bd4d3e877367b341f77ee7': '11_Privacy_High_Fidelity_Voxel',
    '909696279bd84a89834030e1e1e18869': '12_Welcome_High_Fidelity_Voxel',
    '75281a3a3dd04ce0a98d6cc85128940d': '13_Goal_High_Fidelity_Voxel'
}

with open(r'C:\Users\gokul\.gemini\antigravity\brain\ea16465f-e4f2-4a03-922b-8bafd114e864\.system_generated\steps\12\output.txt', 'r', encoding='utf-8') as f:
    screens_data = json.load(f)

for screen in screens_data.get('screens', []):
    screen_name = screen.get('name', '')
    screen_id = screen_name.split('/')[-1]
    
    if screen_id in target_ids:
        prefix = target_ids[screen_id]
        
        # Download screenshot
        screenshot_url = screen.get('screenshot', {}).get('downloadUrl')
        if screenshot_url:
            print(f"Downloading screenshot for {prefix}...")
            os.system(f'curl -L -o "stitch_screens/{prefix}.png" "{screenshot_url}"')
            
        # Download HTML
        html_url = screen.get('htmlCode', {}).get('downloadUrl')
        if html_url:
            print(f"Downloading HTML for {prefix}...")
            os.system(f'curl -L -o "stitch_screens/{prefix}.html" "{html_url}"')

print("Done downloading all requested screens.")
