import gzip
import os
import re
import shutil
import subprocess
import json
from SCons.Script import Import

Import("env")

# ──────────────────────────────────────────────
# Config
# ──────────────────────────────────────────────
SRC_DIR_NAME = "frontend"
DST_DIR_NAME = "data"

# Extensions à traiter (Minify + Gzip)
MINIFY_AND_GZIP = {".html", ".htm", ".css", ".js", ".json", ".svg", ".xml"}
PNG_EXTENSIONS = {".png"}

def _project_dir():
    return env.subst("$PROJECT_DIR")

def _src_dir():
    return os.path.join(_project_dir(), SRC_DIR_NAME)

def _dst_dir():
    return os.path.join(_project_dir(), DST_DIR_NAME)

# ──────────────────────────────────────────────
# Minificateurs
# ──────────────────────────────────────────────

def minify_html(text: str) -> str:
    text = re.sub(r"<!--(?!\[if).*?-->", "", text, flags=re.DOTALL)
    text = re.sub(r">\s+<", "> <", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()

def minify_css(text: str) -> str:
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.DOTALL)
    text = re.sub(r"\s*([:{};,])\s*", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()

def minify_js(text: str) -> str:
    # STRATÉGIE SÉCURITÉ TOTALE : 
    # On ne touche à rien, Gzip compressera les espaces et commentaires.
    # Cela garantit que baseUrl et tes arrays d'erreurs restent intacts.
    return text

def minify_json(text: str) -> str:
    try:
        data = json.loads(text)
        return json.dumps(data, separators=(",", ":"), ensure_ascii=False)
    except:
        return text

def minify_svg(text: str) -> str:
    text = re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL)
    return re.sub(r">\s+<", "><", text).strip()

# Association des extensions aux fonctions
MINIFIERS = {
    ".html": minify_html,
    ".htm":  minify_html,
    ".css":  minify_css,
    ".js":   minify_js,
    ".json": minify_json,
    ".svg":  minify_svg,
    ".xml":  minify_svg,
}

# ──────────────────────────────────────────────
# Logique de traitement
# ──────────────────────────────────────────────

def process_file(src_path: str, dst_path: str):
    ext = os.path.splitext(src_path)[1].lower()
    original_size = os.path.getsize(src_path)
    
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)

    if ext in MINIFY_AND_GZIP:
        with open(src_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # Minification
        minifier = MINIFIERS.get(ext)
        if minifier:
            content = minifier(content)
            action = "minify+gzip"
        else:
            action = "gzip"

        # Compression Gzip
        gz_path = dst_path + ".gz"
        with gzip.open(gz_path, "wb", compresslevel=9) as gz:
            gz.write(content.encode("utf-8"))
        
        final_size = os.path.getsize(gz_path)
        return action, original_size, final_size

    # PNG et autres : Copie simple
    shutil.copy2(src_path, dst_path)
    return "copy", original_size, original_size

def minify_all():
    src_dir = _src_dir()
    dst_dir = _dst_dir()

    if not os.path.isdir(src_dir):
        return

    # Nettoyage du dossier destination
    if os.path.exists(dst_dir):
        shutil.rmtree(dst_dir)
    os.makedirs(dst_dir, exist_ok=True)

    print(f"\n[minify] Optimisation des assets : {SRC_DIR_NAME} -> {DST_DIR_NAME}")

    for root, dirs, files in os.walk(src_dir):
        for fname in sorted(files):
            if fname.startswith(".") or fname.endswith("~"): continue
            
            src_path = os.path.join(root, fname)
            rel_path = os.path.relpath(src_path, src_dir)
            dst_path = os.path.join(dst_dir, rel_path)

            action, old_sz, new_sz = process_file(src_path, dst_path)
            
            saved = old_sz - new_sz
            pct = (saved / old_sz * 100) if old_sz > 0 else 0
            print(f"  {rel_path:<30} {old_sz:>7} -> {new_sz:>7} B ({pct:>3.0f}%) [{action}]")

# Lancement
minify_all()
