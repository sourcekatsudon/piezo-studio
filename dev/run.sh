#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Using project root: $ROOT_DIR"
cd "$ROOT_DIR"

HOST=${HOST:-127.0.0.1}
PORT=${PORT:-3004}
URL="http://${HOST}:${PORT}"

export NODE_PATH="$ROOT_DIR/node_modules"

if [ ! -d "$ROOT_DIR/node_modules/tailwindcss" ]; then
  echo "Dependencies missing. Running pnpm install..."
  NODE_ENV=development pnpm -C "$ROOT_DIR" install --prod=false
fi

NODE_ENV=development node "$ROOT_DIR/node_modules/next/dist/bin/next" dev "$ROOT_DIR" --webpack --hostname "$HOST" --port "$PORT" &
DEV_PID=$!

cleanup() {
  kill "$DEV_PID" 2>/dev/null || true
}
trap cleanup EXIT

until curl -fsS "$URL" >/dev/null 2>&1; do
  sleep 0.5
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    echo "Dev server exited before becoming ready." >&2
    exit 1
  fi
done

if command -v open >/dev/null 2>&1; then
  open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL"
else
  echo "Open this URL in your browser: $URL"
fi

wait "$DEV_PID"
