#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")"; pwd)"
VENVDIR="$ROOT_DIR/.selenium_venv"
REQ_FILE="$ROOT_DIR/tests/selenium/requirements.txt"

echo "Proyecto: $ROOT_DIR"

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 no encontrado. Instala Python 3."
  exit 1
fi

if [ ! -f "$REQ_FILE" ]; then
  echo "requirements.txt no encontrado en tests/selenium/"
  exit 1
fi

if [ ! -d "$VENVDIR" ]; then
  python3 -m venv "$VENVDIR"
fi

# Activar entorno virtual
# shellcheck source=/dev/null
source "$VENVDIR/bin/activate"

pip install --upgrade pip
pip install -r "$REQ_FILE"

# Ejecutar pytest en la carpeta de tests Selenium
pytest -q tests/selenium