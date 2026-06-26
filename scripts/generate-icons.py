#!/usr/bin/env python3
"""
Genera los íconos requeridos por Tauri a partir de una imagen PNG fuente.

Uso:
    python scripts/generate-icons.py path/to/icon-1024x1024.png

Requisitos:
    pip install Pillow

Genera en src-tauri/icons/:
    - 32x32.png
    - 128x128.png
    - 128x128@2x.png (256x256)
    - icon.icns (macOS)
    - icon.ico (Windows)
    - android/ (varios tamaños para Android)
"""

import sys
import struct
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow no está instalado.")
    print("Instálalo con: pip install Pillow")
    sys.exit(1)


def generate_ico(img: Image.Image, output_path: Path) -> None:
    """Genera un archivo .ico con múltiples tamaños."""
    sizes = [16, 24, 32, 48, 64, 128, 256]
    icons = []
    for size in sizes:
        resized = img.resize((size, size), Image.LANCZOS)
        icons.append(resized)
    icons[0].save(str(output_path), format="ICO", sizes=[(s, s) for s in sizes], append_images=icons[1:])


def generate_icns(img: Image.Image, output_path: Path) -> None:
    """Genera un archivo .icns para macOS."""
    # .icns format: header + icon entries
    # We'll use the supported icon types
    icon_types = [
        (b"icp4", 16),    # 16x16
        (b"icp5", 32),    # 32x32
        (b"icp6", 64),    # 64x64
        (b"ic07", 128),   # 128x128
        (b"ic08", 256),   # 256x256
        (b"ic09", 512),   # 512x512
        (b"ic10", 1024),  # 1024x1024
    ]

    entries = []
    for icon_type, size in icon_types:
        resized = img.resize((size, size), Image.LANCZOS)
        import io
        buf = io.BytesIO()
        resized.save(buf, format="PNG")
        png_data = buf.getvalue()
        # Entry: type (4 bytes) + length (4 bytes, includes type+length) + data
        entry_length = 8 + len(png_data)
        entry = icon_type + struct.pack(">I", entry_length) + png_data
        entries.append(entry)

    # File: magic "icns" + total length + entries
    all_entries = b"".join(entries)
    total_length = 8 + len(all_entries)
    icns_data = b"icns" + struct.pack(">I", total_length) + all_entries

    output_path.write_bytes(icns_data)


def main() -> None:
    if len(sys.argv) != 2:
        print("Uso: python scripts/generate-icons.py <ruta-a-imagen-png>")
        print("  La imagen debe ser cuadrada, idealmente 1024x1024 px.")
        sys.exit(1)

    source_path = Path(sys.argv[1])
    if not source_path.exists():
        print(f"Error: No se encontró el archivo '{source_path}'")
        sys.exit(1)

    # Resolve output directory
    script_dir = Path(__file__).resolve().parent
    project_root = script_dir.parent
    icons_dir = project_root / "src-tauri" / "icons"
    icons_dir.mkdir(parents=True, exist_ok=True)

    # Load source image
    img = Image.open(source_path).convert("RGBA")
    width, height = img.size
    if width != height:
        print(f"Advertencia: La imagen no es cuadrada ({width}x{height}). Se recortará al centro.")
        min_dim = min(width, height)
        left = (width - min_dim) // 2
        top = (height - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))

    print(f"Imagen fuente: {source_path} ({img.size[0]}x{img.size[1]})")
    print(f"Directorio de salida: {icons_dir}")
    print()

    # Generate PNGs
    png_sizes = {
        "32x32.png": 32,
        "128x128.png": 128,
        "128x128@2x.png": 256,
    }

    for filename, size in png_sizes.items():
        output = icons_dir / filename
        resized = img.resize((size, size), Image.LANCZOS)
        resized.save(str(output), format="PNG")
        print(f"  ✓ {filename} ({size}x{size})")

    # Generate .ico (Windows)
    ico_path = icons_dir / "icon.ico"
    generate_ico(img, ico_path)
    print(f"  ✓ icon.ico (multi-size)")

    # Generate .icns (macOS)
    icns_path = icons_dir / "icon.icns"
    generate_icns(img, icns_path)
    print(f"  ✓ icon.icns (multi-size)")

    # Generate Android icons
    android_dir = icons_dir / "android"
    android_dir.mkdir(parents=True, exist_ok=True)

    android_sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }

    for folder, size in android_sizes.items():
        folder_path = android_dir / folder
        folder_path.mkdir(parents=True, exist_ok=True)
        output = folder_path / "ic_launcher.png"
        resized = img.resize((size, size), Image.LANCZOS)
        resized.save(str(output), format="PNG")

        # Also generate round version
        output_round = folder_path / "ic_launcher_round.png"
        resized.save(str(output_round), format="PNG")
        print(f"  ✓ {folder}/ic_launcher.png ({size}x{size})")

    # Copy to Android gen resources if they exist
    android_res_dir = project_root / "src-tauri" / "gen" / "android" / "app" / "src" / "main" / "res"
    if android_res_dir.exists():
        print()
        print("Copiando al proyecto Android generado...")
        for folder, size in android_sizes.items():
            res_folder = android_res_dir / folder
            if res_folder.exists():
                source = android_dir / folder / "ic_launcher.png"
                (res_folder / "ic_launcher.png").write_bytes(source.read_bytes())
                (res_folder / "ic_launcher_foreground.png").write_bytes(source.read_bytes())
                (res_folder / "ic_launcher_round.png").write_bytes(source.read_bytes())
                print(f"  ✓ res/{folder}/")
    else:
        print()
        print("  ⚠ src-tauri/gen/android no existe aún. Ejecuta 'npx tauri android init' y vuelve a correr este script.")

    print()
    print("¡Listo! Todos los íconos fueron generados.")


if __name__ == "__main__":
    main()
