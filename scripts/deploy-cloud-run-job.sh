#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Rovan: Cloud Run Jobs + Cloud Scheduler 一撃デプロイスクリプト
# 週次測定の期日と分割処理の再開はDBで管理。規模別の負荷試験は別途必要。
# ==============================================================================

REGION="${GCP_REGION:-asia-northeast1}"
JOB_NAME="aix-weekly-watch"
SCHEDULER_JOB_NAME="aix-weekly-watch-trigger"
REPO_NAME="aix-jobs"
CRON_SCHEDULE="${WATCH_CRON_SCHEDULE:-*/15 * * * *}" # 期日到来・分割再開のみをclaimする
TIMEZONE="Asia/Tokyo"

# GCP プロジェクトIDの検証
PROJECT_ID="${GCP_PROJECT_ID:?Set the Rovan project ID explicitly}"
: "${ROVAN_RUNTIME_SERVICE_ACCOUNT:?Set the Rovan runtime service account}"
: "${ROVAN_SECRETS:?Set ENV_VAR=secret-name:version mappings}"
if [ -z "$PROJECT_ID" ]; then
  echo "【エラー】GCPプロジェクトが設定されていません。"
  echo "export GCP_PROJECT_ID=\"your-project-id\" を実行するか、gcloud config set project を実行してください。"
  exit 1
fi

echo "=================================================="
echo "Rovan: Cloud Run Jobs デプロイ開始"
echo "Project ID: $PROJECT_ID"
echo "Region:     $REGION"
echo "Job Name:   $JOB_NAME"
echo "Schedule:   $CRON_SCHEDULE ($TIMEZONE)"
echo "=================================================="

# 1. 必要なGoogle Cloud APIの有効化
echo "▶ 必要なAPIを有効化しています..."
gcloud services enable \
  run.googleapis.com \
  cloudscheduler.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  --project="$PROJECT_ID"

# 2. Artifact Registry リポジトリの作成（存在しない場合）
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
  echo "▶ Artifact Registry リポジトリを作成しています: $REPO_NAME..."
  gcloud artifacts repositories create "$REPO_NAME" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Docker repository for Rovan background jobs" \
    --project="$PROJECT_ID"
fi

IMAGE_URI="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$JOB_NAME:$(git rev-parse --short=12 HEAD)"

# 3. コンテナイメージのビルドとプッシュ（Cloud Build利用）
echo "▶ Cloud Buildでコンテナイメージをビルド＆プッシュしています..."
gcloud builds submit \
  --config=cloudbuild.job.yaml \
  --substitutions="_IMAGE=$IMAGE_URI" \
  --project="$PROJECT_ID"

# 4. Cloud Run Job の作成または更新
echo "▶ Cloud Run Job を作成・更新しています: $JOB_NAME..."
if gcloud run jobs describe "$JOB_NAME" --region="$REGION" --project="$PROJECT_ID" &>/dev/null; then
  gcloud run jobs update "$JOB_NAME" \
    --service-account="$ROVAN_RUNTIME_SERVICE_ACCOUNT" \
    --update-secrets="$ROVAN_SECRETS" \
    --image="$IMAGE_URI" \
    --region="$REGION" \
    --tasks=1 \
    --task-timeout=3600s \
    --memory=1Gi \
    --cpu=1 \
    --max-retries=1 \
    --project="$PROJECT_ID"
else
  gcloud run jobs create "$JOB_NAME" \
    --service-account="$ROVAN_RUNTIME_SERVICE_ACCOUNT" \
    --set-secrets="$ROVAN_SECRETS" \
    --image="$IMAGE_URI" \
    --region="$REGION" \
    --tasks=1 \
    --task-timeout=3600s \
    --memory=1Gi \
    --cpu=1 \
    --max-retries=1 \
    --project="$PROJECT_ID"
fi

# 5. Cloud Scheduler ジョブの作成または更新
echo "▶ Cloud Scheduler ジョブを設定しています: $SCHEDULER_JOB_NAME..."
JOB_URI="https://${REGION}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${PROJECT_ID}/jobs/${JOB_NAME}:run"

# サービスアカウント（Cloud Scheduler用実行権限）
SERVICE_ACCOUNT_NAME="aix-scheduler-sa"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

if ! gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" --project="$PROJECT_ID" &>/dev/null; then
  echo "▶ サービスアカウントを作成しています: $SERVICE_ACCOUNT_NAME..."
  gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
    --display-name="Rovan Scheduler Service Account" \
    --project="$PROJECT_ID"
fi

# Cloud Run 起動権限の付与
gcloud run jobs add-iam-policy-binding "$JOB_NAME" --region="$REGION" --project="$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.invoker" >/dev/null

if gcloud scheduler jobs describe "$SCHEDULER_JOB_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
  gcloud scheduler jobs update http "$SCHEDULER_JOB_NAME" \
    --location="$REGION" \
    --schedule="$CRON_SCHEDULE" \
    --time-zone="$TIMEZONE" \
    --uri="$JOB_URI" \
    --http-method=POST \
    --oauth-service-account-email="$SERVICE_ACCOUNT_EMAIL" \
    --project="$PROJECT_ID"
else
  gcloud scheduler jobs create http "$SCHEDULER_JOB_NAME" \
    --location="$REGION" \
    --schedule="$CRON_SCHEDULE" \
    --time-zone="$TIMEZONE" \
    --uri="$JOB_URI" \
    --http-method=POST \
    --oauth-service-account-email="$SERVICE_ACCOUNT_EMAIL" \
    --project="$PROJECT_ID"
fi

echo "=================================================="
echo "✅ Cloud Run Jobs ＋ Cloud Scheduler デプロイ完了！"
echo "ジョブ名:    $JOB_NAME"
echo "起動間隔:    $CRON_SCHEDULE ($TIMEZONE); 測定期日はDBで管理"
echo "手動テスト実行: gcloud run jobs execute $JOB_NAME --region=$REGION --project=$PROJECT_ID"
echo "=================================================="
