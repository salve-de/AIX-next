import { claimDueWatches, updateWatch } from "../lib/storage";
import { processWatchMeasurement } from "../lib/watch-measurement";

/**
 * Cloud Run Jobs / CLI 実行用：週次定期観測・競合差分検知・自走防衛バッチ
 * 
 * スケーラビリティ設計（10,000社耐性）:
 * - Cloud Run Jobs の並列実行（Task 0..N-1）に対応
 * - claimDueWatches によるアトミックなDB排他ロック（二重実行を100%防止）
 * - 構造化ログ（JSON）出力で Cloud Logging での死活監視・メトリクス集計が可能
 */
async function main() {
  const taskIndex = Number(process.env.CLOUD_RUN_TASK_INDEX ?? 0);
  const taskCount = Number(process.env.CLOUD_RUN_TASK_COUNT ?? 1);
  const batchLimit = Number(process.env.WATCH_BATCH_LIMIT ?? 50);
  const leaseSeconds = Number(process.env.WATCH_LEASE_SECONDS ?? 1800); // 30分リース

  console.log(JSON.stringify({
    level: "INFO",
    message: "Starting weekly autonomous watch job",
    taskIndex,
    taskCount,
    batchLimit,
    leaseSeconds,
    timestamp: new Date().toISOString(),
  }));

  let totalProcessed = 0;
  let totalSuccess = 0;
  let totalFailed = 0;
  const errors: Array<{ token: string; error: string }> = [];

  // 1タスクあたり、未処理の監視対象が尽きるまで、または安全リミットまでループ処理
  while (true) {
    const due = await claimDueWatches(Math.min(10, batchLimit), leaseSeconds);
    if (!due || due.length === 0) {
      console.log(JSON.stringify({
        level: "INFO",
        message: "No more due watches to claim. Task finished.",
        taskIndex,
      }));
      break;
    }

    console.log(JSON.stringify({
      level: "INFO",
      message: `Claimed ${due.length} watches for processing`,
      taskIndex,
      companies: due.map((w) => ({ token: w.token, url: w.latest.targetUrl })),
    }));

    for (const watch of due) {
      totalProcessed++;
      const startTime = Date.now();
      try {
        const result = await processWatchMeasurement(watch);
        totalSuccess++;
        console.log(JSON.stringify({
          level: "INFO",
          message: "Successfully processed watch measurement",
          taskIndex,
          token: watch.token,
          durationMs: Date.now() - startTime,
          result: {
            status: result.status,
            completedPrompts: result.completedPrompts,
            totalPrompts: result.totalPrompts,
            observations: result.observations,
            changePackItems: result.changePackItems,
          },
        }));
      } catch (error) {
        totalFailed++;
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push({ token: watch.token, error: errorMessage });

        // 失敗時は1時間後に再試行
        const retryAt = new Date(Date.now() + 60 * 60_000).toISOString();
        await updateWatch(watch.token, { nextRunAt: retryAt });

        console.error(JSON.stringify({
          level: "ERROR",
          message: "Failed to process watch measurement",
          taskIndex,
          token: watch.token,
          error: errorMessage,
          retryAt,
        }));
      }
    }

    if (totalProcessed >= batchLimit) {
      console.log(JSON.stringify({
        level: "WARN",
        message: `Reached task batch limit (${batchLimit}). Yielding remaining to other tasks.`,
        taskIndex,
      }));
      break;
    }
  }

  const summary = {
    level: "INFO",
    message: "Weekly autonomous watch job completed",
    taskIndex,
    totalProcessed,
    totalSuccess,
    totalFailed,
    timestamp: new Date().toISOString(),
  };
  console.log(JSON.stringify(summary));

  if (totalFailed > 0 && totalSuccess === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(JSON.stringify({
    level: "FATAL",
    message: "Unhandled fatal error in watch job",
    error: err instanceof Error ? err.stack || err.message : String(err),
  }));
  process.exit(1);
});
