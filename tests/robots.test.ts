import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedByRobots } from "../lib/robots";

const source = `
User-agent: *
Disallow: /private/
Allow: /private/public/

User-agent: AIXNextBot
Disallow: /blocked/
Allow: /blocked/ok/
`;

test("specific AIX group overrides wildcard group", () => {
  assert.equal(isAllowedByRobots(source, "/private/page", "aixnextbot"), true);
  assert.equal(isAllowedByRobots(source, "/blocked/page", "aixnextbot"), false);
});

test("longest matching allow rule wins", () => {
  assert.equal(isAllowedByRobots(source, "/blocked/ok/page", "aixnextbot"), true);
});

test("wildcard group applies to other agents", () => {
  assert.equal(isAllowedByRobots(source, "/private/page", "otherbot"), false);
  assert.equal(isAllowedByRobots(source, "/private/public/page", "otherbot"), true);
});
