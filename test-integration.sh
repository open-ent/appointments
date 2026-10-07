#!/usr/bin/env bash
# =============================================================================
# Test d'intégration du module Appointments
#
# Exécute un scénario complet contre l'API réelle :
#   1. Récupération de la structure et des publics disponibles
#   2. Création d'une grille de RDV avec créneaux hebdomadaires
#   3. Modification de la grille
#   4. Suspension puis restauration
#   5. Prise de rendez-vous sur un créneau (si STUDENT_COOKIE fourni)
#   6. Acceptation / refus du RDV (si STUDENT_COOKIE fourni)
#   7. Suppression finale (sauf en mode --demo)
#
# Usage :
#   ENT_COOKIE="<cookie>" ./test-integration.sh [OPTIONS]
#
# Options :
#   --demo            Mode démo : laisse les données créées en base (pas de cleanup)
#   --base-url=<url>  URL de base (défaut : https://www.ent-scolaire.fr)
#   --cookie=<val>    Cookie de session enseignant (ou ENT_COOKIE env var)
#   --student-cookie=<val>  Cookie élève pour tester la prise de RDV
#   --structure-id=<id>    ID structure (auto-détecté depuis /auth/oauth2/userinfo)
#   --verbose         Afficher les corps de réponse complets
#
# Exemples :
#   ENT_COOKIE="oneSessionId=xxx" ./test-integration.sh --demo
#   ./test-integration.sh --cookie="oneSessionId=xxx" --student-cookie="oneSessionId=yyy" --demo
# =============================================================================

set -euo pipefail

DEMO_MODE=false
BASE_URL="https://www.ent-scolaire.fr"
COOKIE="${ENT_COOKIE:-}"
STUDENT_COOKIE="${ENT_STUDENT_COOKIE:-}"
STRUCTURE_ID="${ENT_STRUCTURE_ID:-}"
VERBOSE=false

CREATED_GRID_ID=""
CREATED_APPOINTMENT_ID=""

# ---- Couleurs ----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'
BOLD='\033[1m'; NC='\033[0m'

pass() { echo -e "${GREEN}✔${NC}  $*"; }
fail() { echo -e "${RED}✘${NC}  $*"; exit 1; }
info() { echo -e "${BLUE}→${NC}  $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
section() { echo -e "\n${BOLD}$*${NC}"; echo "$(printf '─%.0s' {1..60})"; }

# ---- Parsing args ------------------------------------------------------------
for arg in "$@"; do
  case "$arg" in
    --demo)                DEMO_MODE=true ;;
    --base-url=*)          BASE_URL="${arg#*=}" ;;
    --cookie=*)            COOKIE="${arg#*=}" ;;
    --student-cookie=*)    STUDENT_COOKIE="${arg#*=}" ;;
    --structure-id=*)      STRUCTURE_ID="${arg#*=}" ;;
    --verbose)             VERBOSE=true ;;
    -h|--help)
      sed -n '2,30p' "$0" | sed 's/^# \?//'; exit 0 ;;
    *) echo "Argument inconnu : $arg"; exit 1 ;;
  esac
done

if [[ -z "$COOKIE" ]]; then
  fail "Cookie de session requis. Passez --cookie=<val> ou définissez ENT_COOKIE."
fi

# ---- Fonctions utilitaires ---------------------------------------------------
curl_auth() {
  local method="$1"; shift
  local url="$1"; shift
  curl -s -X "$method" \
    -H "Cookie: $COOKIE" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    "$@" \
    "${BASE_URL}${url}"
}

curl_student() {
  local method="$1"; shift
  local url="$1"; shift
  curl -s -X "$method" \
    -H "Cookie: $STUDENT_COOKIE" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    "$@" \
    "${BASE_URL}${url}"
}

assert_ok() {
  local label="$1"; local body="$2"; local http_code="$3"
  if [[ "$http_code" =~ ^2 ]]; then
    pass "$label (HTTP $http_code)"
  else
    echo -e "${RED}✘${NC}  $label (HTTP $http_code)"
    echo "    Réponse : $body"
    exit 1
  fi
}

jq_or_empty() {
  local json="$1"; local path="$2"; local default="${3:-}"
  echo "$json" | python3 -c "
import json, sys
try:
  d = json.load(sys.stdin)
  parts = '$path'.split('.')
  for p in parts:
    if p: d = d[p] if isinstance(d, dict) else d[int(p)]
  print(d)
except Exception:
  print('$default')
" 2>/dev/null || echo "$default"
}

# ---- Dates de démo (prochaine semaine → +2 mois) ----------------------------
TODAY=$(date +%Y-%m-%d)
NEXT_MONDAY=$(date -d "next monday" +%Y-%m-%d 2>/dev/null || date -v+1w -v+monday +%Y-%m-%d)
END_DATE=$(date -d "$NEXT_MONDAY + 8 weeks" +%Y-%m-%d 2>/dev/null || date -v+8w +%Y-%m-%d)

# ---- 1. Détection de la structure -------------------------------------------
section "1. Identification utilisateur"

USER_INFO=$(curl_auth GET /auth/oauth2/userinfo)
if $VERBOSE; then echo "$USER_INFO" | python3 -m json.tool 2>/dev/null || echo "$USER_INFO"; fi

if [[ -z "$STRUCTURE_ID" ]]; then
  STRUCTURE_ID=$(echo "$USER_INFO" | python3 -c "
import json, sys
d = json.load(sys.stdin)
nodes = d.get('structureNodes', d.get('structures', []))
if nodes: print(nodes[0].get('id',''))
" 2>/dev/null || true)
fi

USER_NAME=$(jq_or_empty "$USER_INFO" "displayName" "Utilisateur test")

if [[ -z "$STRUCTURE_ID" ]]; then
  fail "Impossible de détecter le structureId. Passez --structure-id=<id>"
fi
info "Utilisateur : $USER_NAME"
info "Structure   : $STRUCTURE_ID"

# ---- 2. Récupération des publics disponibles --------------------------------
section "2. Récupération des groupes/publics"

GROUPS_RESP=$(curl_auth GET "/appointments/structures/${STRUCTURE_ID}/communication/from/groups")
GROUP_IDS=$(echo "$GROUPS_RESP" | python3 -c "
import json, sys
d = json.load(sys.stdin)
groups = d if isinstance(d, list) else d.get('data', d.get('groups', []))
ids = [str(g.get('groupId', g.get('id',''))) for g in groups[:3] if g.get('groupId') or g.get('id')]
print(json.dumps(ids))
" 2>/dev/null || echo '[]')

GROUP_COUNT=$(echo "$GROUP_IDS" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))" 2>/dev/null || echo 0)
info "Groupes disponibles : $GROUP_COUNT"
if [[ "$GROUP_COUNT" -eq 0 ]]; then
  warn "Aucun groupe trouvé — la grille sera créée sans public restreint"
  GROUP_IDS='[]'
fi

# ---- 3. Création d'une grille -----------------------------------------------
section "3. Création de la grille de RDV (démo)"

GRID_PAYLOAD=$(python3 -c "
import json
payload = {
  'name': 'Grille démo - Tests intégration',
  'color': '#1976d2',
  'beginDate': '$NEXT_MONDAY',
  'endDate': '$END_DATE',
  'structureId': '$STRUCTURE_ID',
  'duration': '00:30',
  'periodicity': 1,
  'targetPublicListId': $GROUP_IDS,
  'dailySlots': [
    {'day': 'MONDAY',    'beginTime': '09:00', 'endTime': '11:00'},
    {'day': 'WEDNESDAY', 'beginTime': '14:00', 'endTime': '16:00'},
    {'day': 'FRIDAY',    'beginTime': '10:00', 'endTime': '12:00'},
  ],
  'videoCallLink': '',
  'place': 'Salle de réunion 101',
  'documentsIds': [],
  'publicComment': 'Grille créée par le script de test démo',
}
print(json.dumps(payload))
")

RESP=$(curl_auth POST /appointments/grids -d "$GRID_PAYLOAD" -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
if $VERBOSE; then echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"; fi

assert_ok "Création de la grille" "$BODY" "$HTTP_CODE"

CREATED_GRID_ID=$(echo "$BODY" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d.get('id', d.get('gridId','')))" 2>/dev/null || true)

if [[ -z "$CREATED_GRID_ID" ]]; then
  fail "Impossible d'extraire l'ID de la grille créée"
fi
info "Grille créée : ID = $CREATED_GRID_ID"

# ---- 4. Lecture de la grille ------------------------------------------------
section "4. Lecture de la grille"

RESP=$(curl_auth GET "/appointments/grids/${CREATED_GRID_ID}" -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
assert_ok "GET grille $CREATED_GRID_ID" "$BODY" "$HTTP_CODE"

DURATION_BACK=$(echo "$BODY" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d.get('duration',''))" 2>/dev/null || true)
info "Duration retournée par l'API : '$DURATION_BACK'"
if [[ "$DURATION_BACK" == "00:30" ]]; then
  pass "Format duration correct (HH:MM)"
elif [[ "$DURATION_BACK" == "00:30:00" ]]; then
  warn "Duration retournée en HH:MM:SS — vérifier parseDuration côté backend"
else
  warn "Duration inattendue : '$DURATION_BACK'"
fi

# ---- 5. Modification de la grille -------------------------------------------
section "5. Modification de la grille"

UPDATE_PAYLOAD=$(python3 -c "
import json
payload = {
  'name': 'Grille démo - Tests intégration (modifiée)',
  'color': '#2e7d32',
  'beginDate': '$NEXT_MONDAY',
  'endDate': '$END_DATE',
  'structureId': '$STRUCTURE_ID',
  'duration': '00:30',
  'periodicity': 1,
  'targetPublicListId': $GROUP_IDS,
  'dailySlots': [
    {'day': 'MONDAY',    'beginTime': '09:00', 'endTime': '12:00'},
    {'day': 'WEDNESDAY', 'beginTime': '14:00', 'endTime': '17:00'},
    {'day': 'FRIDAY',    'beginTime': '10:00', 'endTime': '12:00'},
  ],
  'videoCallLink': '',
  'place': 'Salle de réunion 101 (modifiée)',
  'documentsIds': [],
  'publicComment': 'Modifiée par le script de test démo',
}
print(json.dumps(payload))
")

RESP=$(curl_auth PUT "/appointments/grids/${CREATED_GRID_ID}" -d "$UPDATE_PAYLOAD" -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
assert_ok "Modification de la grille $CREATED_GRID_ID" "$BODY" "$HTTP_CODE"

# ---- 6. Suspension de la grille ---------------------------------------------
section "6. Suspension de la grille"

RESP=$(curl_auth PUT "/appointments/grids/${CREATED_GRID_ID}/suspend?deleteAppointments=false" -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
assert_ok "Suspension de la grille $CREATED_GRID_ID" "$BODY" "$HTTP_CODE"

# ---- 7. Restauration de la grille -------------------------------------------
section "7. Restauration de la grille"

RESP=$(curl_auth PUT "/appointments/grids/${CREATED_GRID_ID}/restore" -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
assert_ok "Restauration de la grille $CREATED_GRID_ID" "$BODY" "$HTTP_CODE"

# ---- 8. Prise d'un rendez-vous (si cookie élève fourni) ---------------------
if [[ -n "$STUDENT_COOKIE" ]]; then
  section "8. Prise d'un rendez-vous (élève)"

  SLOTS_RESP=$(curl_student GET "/appointments/grids/${CREATED_GRID_ID}/timeslots" -w "\n%{http_code}")
  HTTP_CODE=$(echo "$SLOTS_RESP" | tail -1)
  SLOTS_BODY=$(echo "$SLOTS_RESP" | head -n -1)
  assert_ok "GET créneaux disponibles" "$SLOTS_BODY" "$HTTP_CODE"

  FIRST_SLOT_ID=$(echo "$SLOTS_BODY" | python3 -c "
import json, sys
d = json.load(sys.stdin)
slots = d if isinstance(d, list) else d.get('data', [])
if slots: print(slots[0].get('id',''))
" 2>/dev/null || true)

  if [[ -n "$FIRST_SLOT_ID" ]]; then
    APPT_PAYLOAD='{"isVideoCall": false}'
    RESP=$(curl_student POST "/appointments/appointments/${FIRST_SLOT_ID}" -d "$APPT_PAYLOAD" -w "\n%{http_code}")
    HTTP_CODE=$(echo "$RESP" | tail -1)
    BODY=$(echo "$RESP" | head -n -1)
    assert_ok "Création d'un rendez-vous (slot $FIRST_SLOT_ID)" "$BODY" "$HTTP_CODE"

    CREATED_APPOINTMENT_ID=$(echo "$BODY" | python3 -c "
import json, sys
d = json.load(sys.stdin)
print(d.get('id', d.get('appointmentId','')))" 2>/dev/null || true)
    info "RDV créé : ID = $CREATED_APPOINTMENT_ID"

    # 8b. Acceptation par l'enseignant
    if [[ -n "$CREATED_APPOINTMENT_ID" ]]; then
      section "8b. Acceptation du rendez-vous (enseignant)"
      RESP=$(curl_auth PUT "/appointments/appointments/${CREATED_APPOINTMENT_ID}/accept" -w "\n%{http_code}")
      HTTP_CODE=$(echo "$RESP" | tail -1)
      BODY=$(echo "$RESP" | head -n -1)
      assert_ok "Acceptation du RDV $CREATED_APPOINTMENT_ID" "$BODY" "$HTTP_CODE"
    fi
  else
    warn "Aucun créneau disponible pour le moment (grille peut-être trop récente)"
  fi
else
  section "8. Prise de RDV"
  warn "STUDENT_COOKIE non fourni — étape ignorée (--student-cookie=<val> ou ENT_STUDENT_COOKIE)"
fi

# ---- 9. Liste des grilles actives -------------------------------------------
section "9. Vérification liste des grilles"

RESP=$(curl_auth GET '/appointments/grids?states=%5B%22OPEN%22%5D&page=1&limit=10' -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESP" | tail -1)
BODY=$(echo "$RESP" | head -n -1)
assert_ok "GET grilles OPEN" "$BODY" "$HTTP_CODE"

GRID_COUNT=$(echo "$BODY" | python3 -c "
import json, sys
d = json.load(sys.stdin)
items = d if isinstance(d, list) else d.get('data', [])
print(len(items))" 2>/dev/null || echo "?")
info "Grilles OPEN visibles : $GRID_COUNT"

# ---- 10. Cleanup (sauf mode démo) -------------------------------------------
section "10. Nettoyage"

if $DEMO_MODE; then
  echo -e "${YELLOW}Mode --demo activé : les données sont conservées en base${NC}"
  echo ""
  echo "  Grille créée   : ID $CREATED_GRID_ID (état OPEN)"
  [[ -n "$CREATED_APPOINTMENT_ID" ]] && echo "  RDV créé       : ID $CREATED_APPOINTMENT_ID (état ACCEPTED)"
  echo ""
  echo "  Visible sur : ${BASE_URL}/appointments"
else
  info "Suppression de la grille $CREATED_GRID_ID..."
  RESP=$(curl_auth PUT "/appointments/grids/${CREATED_GRID_ID}/delete?deleteAppointments=true" -w "\n%{http_code}")
  HTTP_CODE=$(echo "$RESP" | tail -1)
  BODY=$(echo "$RESP" | head -n -1)
  assert_ok "Suppression grille $CREATED_GRID_ID" "$BODY" "$HTTP_CODE"
fi

# ---- Résumé -----------------------------------------------------------------
echo ""
echo -e "${BOLD}============================================================${NC}"
echo -e "${GREEN}  Tests d'intégration Appointments : OK${NC}"
echo "  URL         : $BASE_URL"
echo "  Structure   : $STRUCTURE_ID"
if $DEMO_MODE; then
  echo -e "  Mode        : ${YELLOW}DEMO — données conservées${NC}"
else
  echo "  Mode        : cleanup (données supprimées)"
fi
echo -e "${BOLD}============================================================${NC}"
