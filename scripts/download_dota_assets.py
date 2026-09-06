import os
import sys
import json
import struct
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

STEAM_CDN_BASE = "https://cdn.cloudflare.steamstatic.com"
DOTA_VPK_PATH = r"C:\Program Files (x86)\Steam\steamapps\common\dota 2 beta\game\dota\pak01_dir.vpk"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ASSETS_DIR = os.path.join(PROJECT_ROOT, "frontend", "public", "dota_assets")

HEROES_DIR = os.path.join(ASSETS_DIR, "heroes")
ITEMS_DIR = os.path.join(ASSETS_DIR, "items")
ABILITIES_DIR = os.path.join(ASSETS_DIR, "abilities")

def ensure_dirs():
    for d in [HEROES_DIR, ITEMS_DIR, ABILITIES_DIR]:
        os.makedirs(d, exist_ok=True)

def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))

def get_vpk_file_list():
    if not os.path.exists(DOTA_VPK_PATH):
        print(f"VPK not found at {DOTA_VPK_PATH}, skipping local scan.")
        return set(), set(), set()
    
    try:
        with open(DOTA_VPK_PATH, "rb") as f:
            header = f.read(28)
            sig, ver, tree_sz = struct.unpack("<III", header[:12])
            if sig != 0x55aa1234:
                return set(), set(), set()
            tree_data = f.read(tree_sz)
        
        def read_str(data, offset):
            end = data.find(b"\x00", offset)
            return data[offset:end].decode("latin1", errors="ignore"), end + 1

        offset = 0
        vpk_heroes = set()
        vpk_items = set()
        vpk_abilities = set()
        
        while offset < len(tree_data):
            ext, offset = read_str(tree_data, offset)
            if not ext: break
            while True:
                path, offset = read_str(tree_data, offset)
                if not path: break
                while True:
                    filename, offset = read_str(tree_data, offset)
                    if not filename: break
                    offset += 18
                    clean_name = filename.replace("_png", "").replace(".png", "")
                    if path == "panorama/images/heroes":
                        vpk_heroes.add(clean_name)
                    elif path == "panorama/images/items":
                        vpk_items.add(clean_name)
                    elif path == "panorama/images/spellicons":
                        vpk_abilities.add(clean_name)
        
        return vpk_heroes, vpk_items, vpk_abilities
    except Exception as e:
        print(f"Error reading VPK: {e}")
        return set(), set(), set()

def download_file(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 500:
        return True, "cached"
    
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status == 200:
                data = resp.read()
                if len(data) > 500 and b"PNG" in data[:16]:
                    with open(target_path, "wb") as out_f:
                        out_f.write(data)
                    return True, "downloaded"
        return False, "invalid_data"
    except Exception as e:
        return False, str(e)

def main():
    ensure_dirs()
    print("Fetching Dotaconstants data from GitHub...")
    try:
        heroes_data = fetch_json("https://raw.githubusercontent.com/odota/dotaconstants/master/build/heroes.json")
        items_data = fetch_json("https://raw.githubusercontent.com/odota/dotaconstants/master/build/items.json")
        abilities_data = fetch_json("https://raw.githubusercontent.com/odota/dotaconstants/master/build/abilities.json")
    except Exception as e:
        print(f"Failed to fetch dotaconstants: {e}")
        heroes_data, items_data, abilities_data = {}, {}, {}

    vpk_heroes, vpk_items, vpk_abilities = get_vpk_file_list()
    print(f"VPK scanned: {len(vpk_heroes)} heroes, {len(vpk_items)} items, {len(vpk_abilities)} abilities")

    download_queue = []

    # 1. Heroes
    hero_names = set()
    for h in heroes_data.values():
        name = h.get("name", "").replace("npc_dota_hero_", "")
        if name:
            hero_names.add(name)
    for vh in vpk_heroes:
        clean = vh.replace("npc_dota_hero_", "")
        if clean:
            hero_names.add(clean)

    for h_name in sorted(hero_names):
        target = os.path.join(HEROES_DIR, f"{h_name}.png")
        url = f"{STEAM_CDN_BASE}/apps/dota2/images/dota_react/heroes/{h_name}.png"
        download_queue.append(("hero", h_name, url, target))

    # 2. Items
    item_names = set()
    for item_key, item_val in items_data.items():
        clean_key = item_key.replace("item_", "")
        item_names.add(clean_key)
        img = item_val.get("img", "")
        if img:
            base_name = img.split("/")[-1].split("?")[0].replace(".png", "")
            item_names.add(base_name)
    for vi in vpk_items:
        clean = vi.replace("item_", "")
        item_names.add(clean)

    for i_name in sorted(item_names):
        target = os.path.join(ITEMS_DIR, f"{i_name}.png")
        url = f"{STEAM_CDN_BASE}/apps/dota2/images/dota_react/items/{i_name}.png"
        download_queue.append(("item", i_name, url, target))

    # 3. Abilities
    ability_names = set()
    for ab_key in abilities_data.keys():
        ability_names.add(ab_key)
    for va in vpk_abilities:
        ability_names.add(va)

    for a_name in sorted(ability_names):
        target = os.path.join(ABILITIES_DIR, f"{a_name}.png")
        url = f"{STEAM_CDN_BASE}/apps/dota2/images/dota_react/abilities/{a_name}.png"
        download_queue.append(("ability", a_name, url, target))

    print(f"Total download tasks queued: {len(download_queue)}")
    print(f"  - Heroes: {len(hero_names)}")
    print(f"  - Items: {len(item_names)}")
    print(f"  - Abilities: {len(ability_names)}")

    success_count = 0
    cached_count = 0
    fail_count = 0

    with ThreadPoolExecutor(max_workers=20) as executor:
        future_map = {
            executor.submit(download_file, url, target): (category, name)
            for category, name, url, target in download_queue
        }
        for idx, future in enumerate(as_completed(future_map)):
            category, name = future_map[future]
            ok, status = future.result()
            if ok:
                if status == "cached":
                    cached_count += 1
                else:
                    success_count += 1
            else:
                fail_count += 1

            if (idx + 1) % 250 == 0 or idx + 1 == len(download_queue):
                print(f"Progress: {idx + 1}/{len(download_queue)} [Saved: {success_count}, Cached: {cached_count}, Skipped/404: {fail_count}]")

    print("\nDownload complete!")
    print(f"Summary: {success_count} downloaded, {cached_count} cached, {fail_count} skipped/not on CDN.")

    manifest = {
        "heroes": sorted([f.replace(".png", "") for f in os.listdir(HEROES_DIR) if f.endswith(".png")]),
        "items": sorted([f.replace(".png", "") for f in os.listdir(ITEMS_DIR) if f.endswith(".png")]),
        "abilities": sorted([f.replace(".png", "") for f in os.listdir(ABILITIES_DIR) if f.endswith(".png")]),
    }
    manifest_path = os.path.join(ASSETS_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as mf:
        json.dump(manifest, mf, indent=2)

    print(f"Manifest saved to {manifest_path}:")
    print(f"  - Heroes available: {len(manifest['heroes'])}")
    print(f"  - Items available: {len(manifest['items'])}")
    print(f"  - Abilities available: {len(manifest['abilities'])}")

if __name__ == "__main__":
    main()
