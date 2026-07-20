#!/bin/sh
set -e

echo "⏳ Attente de la base de données et application du schéma…"

# Retry drizzle-kit push until the database is reachable and the schema is applied.
n=0
until npx drizzle-kit push; do
  n=$((n + 1))
  if [ "$n" -ge 30 ]; then
    echo "❌ Base de données injoignable après plusieurs tentatives."
    exit 1
  fi
  echo "   …nouvelle tentative ($n/30) dans 2s"
  sleep 2
done

echo "✅ Schéma appliqué. Démarrage du serveur Nuxt."
exec node .output/server/index.mjs
