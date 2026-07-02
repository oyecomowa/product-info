#!/usr/bin/env bash
set -euo pipefail

# Optional variables:
# - ENV_FILE: Env file path to load deployment variables (default: .env.production)
ENV_FILE="${ENV_FILE:-.env.production}"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

# Required variables:
# - SSH_HOST: SSH config host alias (from ~/.ssh/config)
# - ECS_PATH: Absolute target directory on ECS
# Optional variables:
# - CLEAN_REMOTE: Whether to clear ECS_PATH before upload (default: 1)

: "${SSH_HOST:?Missing SSH_HOST}"
: "${ECS_PATH:?Missing ECS_PATH}"

CLEAN_REMOTE="${CLEAN_REMOTE:-1}"
ARCHIVE_NAME="product-info-$(date +%Y%m%d%H%M%S).tar.gz"
LOCAL_ARCHIVE="/tmp/${ARCHIVE_NAME}"
REMOTE_ARCHIVE="/tmp/${ARCHIVE_NAME}"

if [[ ! -d "out" ]]; then
  echo "[build:ship] Building static export..."
  npm run build
else
  echo "[build:ship] Found existing out directory. Rebuilding to keep output fresh..."
  npm run build
fi

if [[ ! -d "out" ]]; then
  echo "[build:ship] Error: out directory not found after build."
  exit 1
fi

if [[ "${CLEAN_REMOTE}" == "1" ]]; then
  echo "[build:ship] CLEAN_REMOTE=1, remote target will be cleaned before extract"
else
  echo "[build:ship] CLEAN_REMOTE=0, skipping remote cleanup"
fi

echo "[build:ship] Packing out directory to tar.gz..."
tar -C out -czf "${LOCAL_ARCHIVE}" .

echo "[build:ship] Uploading archive via scp..."
scp "${LOCAL_ARCHIVE}" "${SSH_HOST}:${REMOTE_ARCHIVE}"

echo "[build:ship] Extracting archive on remote host..."
ssh "${SSH_HOST}" "bash -s" -- "${ECS_PATH}" "${REMOTE_ARCHIVE}" "${CLEAN_REMOTE}" <<'EOF'
set -euo pipefail

ecs_path="$1"
remote_archive="$2"
clean_remote="$3"

mkdir -p "$ecs_path"

if [[ "$clean_remote" == "1" ]]; then
  case "$ecs_path" in
    "/" | "")
      echo "Refusing to clean unsafe ECS_PATH"
      exit 1
      ;;
  esac

  find "$ecs_path" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
fi

tar -xzf "$remote_archive" -C "$ecs_path"
rm -f "$remote_archive"
EOF

rm -f "${LOCAL_ARCHIVE}"

echo "[build:ship] Deployment complete."
