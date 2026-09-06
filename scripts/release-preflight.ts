import { loadEnvConfig } from "@next/env";
import { configurationFailures } from "../lib/runtime-readiness";

loadEnvConfig(process.cwd());

async function main() {
  const failures = configurationFailures();
  if (failures.length) {
    console.error(JSON.stringify({ ready: false, missingOrInvalid: failures }, null, 2));
    process.exitCode = 1;
    return;
  }
  // Read only: verify all tables used by real flows without printing rows or credentials.
  const tables = ["aix_next_scans", "aix_next_watches", "aix_next_public_profiles", "aix_next_watch_runs"];
  const checks = await Promise.all(tables.map(async (table) => {
    try {
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${table}?select=id&limit=0`, {
        headers: { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!, authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
        signal: AbortSignal.timeout(10_000),
      });
      return { table, reachable: response.ok, status: response.status };
    } catch { return { table, reachable: false, status: "unreachable" }; }
  }));
  const ready = checks.every((check) => check.reachable);
  console.log(JSON.stringify({ ready, checks, liveAiBillingAndEmailVerified: false }, null, 2));
  if (!ready) process.exitCode = 1;
}

void main();
