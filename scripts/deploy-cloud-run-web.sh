#!/usr/bin/env bash
set -euo pipefail

# Explicit project selection prevents deploying into an unrelated gcloud default.
: "${GCP_PROJECT_ID:?Set the Rovan project ID}"
: "${NEXT_PUBLIC_SITE_URL:?Set the HTTPS public origin used at build and runtime}"
: "${ROVAN_IMAGE:?Set the immutable Artifact Registry image tag}"
: "${ROVAN_RUNTIME_SERVICE_ACCOUNT:?Set the Rovan runtime service account}"
: "${ROVAN_SECRETS:?Set ENV_VAR=secret-name:version mappings, never secret values}"
REGION="${GCP_REGION:-asia-northeast1}"
SERVICE="${ROVAN_SERVICE:-rovan-web}"

gcloud builds submit . --config=cloudbuild.web.yaml \
  --substitutions="_IMAGE=$ROVAN_IMAGE,_PUBLIC_ORIGIN=$NEXT_PUBLIC_SITE_URL" \
  --project="$GCP_PROJECT_ID"

# A new service defaults to private. Do not alter an existing service's IAM:
# --no-allow-unauthenticated would also remove public access to its live revision.
# Verify the tagged candidate before routing production traffic.
gcloud run deploy "$SERVICE" --image="$ROVAN_IMAGE" \
  --project="$GCP_PROJECT_ID" --region="$REGION" \
  --service-account="$ROVAN_RUNTIME_SERVICE_ACCOUNT" \
  --update-env-vars="NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL" \
  --update-secrets="$ROVAN_SECRETS" \
  --memory=1Gi --cpu=1 --concurrency=8 --min=0 --max=3 \
  --timeout=300 --quiet --no-traffic --tag=release-candidate
