/**
 * Shared utilities for automation scripts.
 *
 * Centralizes patterns that were duplicated across generate-post.ts,
 * generate-fortunes.ts, generate-horoscopes.ts, generate-seasonal.ts,
 * and quality-check.ts:
 *
 * - callWithRetry: API call retry with configurable attempts and delay
 * - extractJson: Safe JSON extraction from LLM text responses
 * - log: Consistent structured logging helpers
 * - requireEnv: Environment variable validation with actionable errors
 * - ensureFileExists: Create data files with defaults on first run
 */

import fs from "fs";

// ---------------------------------------------------------------------------
// Retry
// ---------------------------------------------------------------------------

/**
 * Retries an async function up to `maxAttempts` times with a fixed delay
 * between failures.  Logs each retry so CI output is traceable.
 */
export async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 30000,
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(
        `[retry] Attempt ${attempt}/${maxAttempts} failed: ${msg}. Retrying in ${delayMs / 1000}s...`,
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new Error("Unreachable");
}

// ---------------------------------------------------------------------------
// JSON extraction
// ---------------------------------------------------------------------------

/**
 * Safely extract and parse a JSON value from a free-form LLM response.
 *
 * Handles:
 * - Markdown code fences (```json ... ```)
 * - Trailing commas
 * - Greedy-regex pitfalls (uses balanced-bracket counting instead)
 *
 * @param text   Raw text from LLM response
 * @param type   "object" to find `{ ... }`, "array" to find `[ ... ]`
 * @returns      The parsed value (caller should validate the shape)
 * @throws       If no valid JSON of the requested type is found
 */
export function extractJson(text: string, type: "object" | "array"): unknown {
  let cleaned = text.trim();

  // Strip markdown fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");
  }

  // Remove trailing commas before } or ]
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  // Find the outermost balanced delimiter
  const open = type === "object" ? "{" : "[";
  const close = type === "object" ? "}" : "]";

  const start = cleaned.indexOf(open);
  if (start === -1) {
    throw new Error(`No JSON ${type} found in response (no '${open}' character)`);
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const ch = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        const jsonStr = cleaned.slice(start, i + 1);
        try {
          return JSON.parse(jsonStr);
        } catch (e) {
          throw new Error(
            `Found JSON ${type} but failed to parse: ${e instanceof Error ? e.message : e}`,
          );
        }
      }
    }
  }

  throw new Error(`No balanced JSON ${type} found in response (unmatched brackets)`);
}

// ---------------------------------------------------------------------------
// Logging
// ---------------------------------------------------------------------------

export const log = {
  info: (msg: string) => console.log(`[info] ${msg}`),
  warn: (msg: string) => console.warn(`[warn] ${msg}`),
  error: (msg: string) => console.error(`[error] ${msg}`),
  ok: (msg: string) => console.log(`[ok] ${msg}`),
  step: (msg: string) => console.log(`\n--- ${msg} ---`),
};

// ---------------------------------------------------------------------------
// Environment helpers
// ---------------------------------------------------------------------------

/**
 * Returns the value of an environment variable, or throws with an
 * actionable message naming the variable and suggesting where to set it.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} environment variable is required. ` +
        `Set it in .env.local (local dev) or as a GitHub Actions secret (CI).`,
    );
  }
  return value;
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------

/**
 * Ensures a JSON data file exists.  If missing, writes `defaultValue`
 * so that scripts can run on a fresh checkout without crashing.
 *
 * @returns The parsed contents of the file
 */
export function ensureFileExists<T>(filePath: string, defaultValue: T): T {
  if (!fs.existsSync(filePath)) {
    log.warn(`${filePath} not found — creating with defaults.`);
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2) + "\n");
    return defaultValue;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
