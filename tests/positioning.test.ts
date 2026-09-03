import test from "node:test";
import assert from "node:assert/strict";
import { sampleResult } from "@/lib/sample-data";
import { derivePositioningAdvice } from "@/lib/positioning";

test("derivePositioningAdvice: 競合の弱点、自社の看板、全方位発信文を正常に導出する", () => {
  const positioning = derivePositioningAdvice(sampleResult);

  assert.ok(positioning.winningAngle, "勝てる看板が存在すること");
  assert.ok(positioning.summary, "解説サマリーが存在すること");

  assert.ok(positioning.competitorWeaknesses.length > 0, "競合の弱点が1件以上存在すること");
  for (const item of positioning.competitorWeaknesses) {
    assert.ok(item.competitor, "競合名が存在すること");
    assert.ok(item.weakness.length > 5, "弱点・隙間の説明が存在すること");
    assert.ok(item.rationale.length > 10, "選ばれる理由が存在すること");
  }

  assert.equal(positioning.actionableMessages.length, 3, "発信文が3チャネル分存在すること");
  const channels = positioning.actionableMessages.map((m) => m.channel);
  assert.ok(channels.includes("profile"), "SNSプロフィール用が存在すること");
  assert.ok(channels.includes("blog"), "ブログ記事用が存在すること");
  assert.ok(channels.includes("flyer"), "チラシ・印刷物用が存在すること");

  for (const msg of positioning.actionableMessages) {
    assert.ok(msg.copy.length > 10, "コピペ用の本文が存在すること");
    assert.ok(msg.instruction.length > 5, "使い方指示が存在すること");
  }
});
