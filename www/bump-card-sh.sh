#!/bin/sh
# bump-card-sh.sh — version sans python3, sh pur (pour terminal HA)
# Usage : sh bump-card-sh.sh neon-header-card.js
#         sh bump-card-sh.sh all

STORAGE="/config/.storage/lovelace_resources"
TARGET="${1:-}"

if [ -z "$TARGET" ]; then
  echo "Usage: $0 <filename.js|all>"
  echo "  ex: $0 neon-header-card.js"
  echo "  ex: $0 all"
  exit 1
fi

if [ ! -f "$STORAGE" ]; then
  echo "Erreur: $STORAGE introuvable"
  exit 1
fi

TS=$(date +%s)000

cp "$STORAGE" "$STORAGE.bak"

if [ "$TARGET" = "all" ]; then
  # Remplace tous les hacstag= dans les URLs /local/
  sed -i "s|/local/\([^?\"]*\)?hacstag=[0-9]*|/local/\1?hacstag=$TS|g" "$STORAGE"
  echo "Toutes les cards bumpées → hacstag=$TS"
else
  FILENAME=$(echo "$TARGET" | sed 's|[\/&]|\\&|g')
  sed -i "s|/local/${FILENAME}?hacstag=[0-9]*|/local/${FILENAME}?hacstag=${TS}|g" "$STORAGE"
  echo "OK  $TARGET → hacstag=$TS"
fi

echo ""
echo "→ Reload le frontend HA (F5 ou Developer Tools → YAML → Reload Resources)"
