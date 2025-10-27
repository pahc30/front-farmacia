#!/usr/bin/env bash
set -e
ROOT="$(cd "$(dirname "$0")/.."; pwd)"
CFG_PATH="$ROOT/tests/selenium/config.py"

echo "Detectando selectores y rutas en $ROOT ..."

# Detectar posible clave de localStorage usada en el frontend
KEY=$(grep -R --line-number "localStorage.setItem" src 2>/dev/null | sed -n '1p' | sed -E "s/.*localStorage.setItem\((['\"])([^'\"]+)\1.*/\2/" || true)
if [ -z "$KEY" ]; then
  KEY="jwtToken"
fi

# Buscar selectores por patrones comunes
USERNAME_CSS=$(grep -R -n -E "formControlName=['\"]username['\"]|name=['\"]username['\"]|id=['\"][^'\"]*username[^'\"]*['\"]" src 2>/dev/null | head -n1 | sed -E "s/.*(formControlName=['\"][^'\"]+['\"]|name=['\"][^'\"]+['\"]|id=['\"][^'\"]+['\"]).*/\1/" | sed -E "s/(formControlName=|name=|id=)//g" | tr -d "'" | tr -d '"' || true)
PASSWORD_CSS=$(grep -R -n -E "formControlName=['\"]password['\"]|name=['\"]password['\"]|id=['\"][^'\"]*password[^'\"]*['\"]" src 2>/dev/null | head -n1 | sed -E "s/.*(formControlName=['\"][^'\"]+['\"]|name=['\"][^'\"]+['\"]|id=['\"][^'\"]+['\"]).*/\1/" | sed -E "s/(formControlName=|name=|id=)//g" | tr -d "'" | tr -d '"' || true)

# Normalize defaults
if [ -z "$USERNAME_CSS" ]; then USERNAME_CSS="input[name='username']"; fi
if [ -z "$PASSWORD_CSS" ]; then PASSWORD_CSS="input[name='password']"; fi

# Detectar ruta de login en routing modules o routerLink
LOGIN_ROUTE=$(grep -R --line-number -E "path:\s*['\"]login['\"]|routerLink=['\"][^'\"]*login" src 2>/dev/null | head -n1 || true)
if [ -n "$LOGIN_ROUTE" ]; then
  LOGIN_ROUTE=$(echo "$LOGIN_ROUTE" | sed -E "s/.*routerLink=['\"]([^'\"]*)['\"].*/\1/; s/.*path:\s*['\"]([^'\"]+)['\"].*/\1/" | sed -n '1p')
  if [[ "$LOGIN_ROUTE" != /* ]]; then LOGIN_ROUTE="/$LOGIN_ROUTE"; fi
else
  LOGIN_ROUTE="/auth/login"
fi

# Detectar ruta protegida candidata por canActivate/Guard
PROTECTED_ROUTE=$(grep -R --line-number -E "canActivate|AuthGuard" src 2>/dev/null | head -n1 || true)
if [ -n "$PROTECTED_ROUTE" ]; then
  PROTECTED_ROUTE=$(echo "$PROTECTED_ROUTE" | sed -E "s/.*path:\s*['\"]([^'\"]+)['\"].*/\1/" | sed -n '1p')
  if [ -z "$PROTECTED_ROUTE" ]; then PROTECTED_ROUTE="/dashboard"; fi
  if [[ "$PROTECTED_ROUTE" != /* ]]; then PROTECTED_ROUTE="/$PROTECTED_ROUTE"; fi
else
  PROTECTED_ROUTE="/dashboard"
fi

SUBMIT_CSS="button[type='submit']"
ERROR_CSS=".alert-error, .mat-error, .toast-error"
PROFILE_CSS="[data-test='profile-name'], #profile-name"

# Escribe el archivo de config
mkdir -p "$(dirname "$CFG_PATH")"
cat > "$CFG_PATH" <<EOF
# Configuración autogenerada por scripts/detect_and_update_selenium_config.sh
BASE_URL = "http://localhost:4200"
LOGIN_PATH = "$LOGIN_ROUTE"
PROTECTED_PATH = "$PROTECTED_ROUTE"

SELECTORS = {
    "username": "${USERNAME_CSS}",
    "password": "${PASSWORD_CSS}",
    "submit": "${SUBMIT_CSS}",
    "error_alert": "${ERROR_CSS}",
    "profile_element": "${PROFILE_CSS}"
}

LOCALSTORAGE_TOKEN_KEY = "${KEY}"

# Credenciales de prueba (edítalas según tu entorno de testing)
VALID_USER = ("testuser", "testpassword")
INVALID_USER = ("invalid_user", "badpass")

TEST_VALID_TOKEN = "ey.test.token.placeholder"
EOF

echo "Archivo actualizado: $CFG_PATH"
echo "Valores detectados:"
echo "  localStorage key: ${KEY}"
echo "  login path: ${LOGIN_ROUTE}"
echo "  protected path: ${PROTECTED_ROUTE}"
echo "  username selector: ${USERNAME_CSS}"
echo "  password selector: ${PASSWORD_CSS}"
echo ""
echo "Revisa tests/selenium/config.py y ajusta VALID_USER / TEST_VALID_TOKEN si es necesario."