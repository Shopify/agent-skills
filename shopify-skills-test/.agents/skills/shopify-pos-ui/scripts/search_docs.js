#!/usr/bin/env node
// AUTO-GENERATED — do not edit directly.
// Edit src/agent-skills/scripts/ in shopify-dev-tools and run: npm run generate_agent_skills

// src/agent-skills/scripts/search_docs.ts
var SHOPIFY_DEV_BASE_URL = process.env.DEV && process.env.DEV !== "false" ? "https://shopify-dev.shop.dev/" : "https://shopify.dev/";
async function performSearch(query2, apiName2, useLegacy) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Shopify-Surface": "skills"
  };
  if (useLegacy) {
    headers["X-Shopify-Dev-Use-OpenAI-Search"] = "true";
  }
  const body = { query: query2, num_results: 5 };
  if (apiName2) body.api_name = apiName2;
  const url = new URL("/assistant/search", SHOPIFY_DEV_BASE_URL);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      errorBody ? `HTTP ${response.status}: ${errorBody}` : `HTTP error! status: ${response.status}`
    );
  }
  const responseText = await response.text();
  try {
    const jsonData = JSON.parse(responseText);
    return JSON.stringify(jsonData, null, 2).replace(/[\u200B\u200C\u200D\uFEFF]/g, "");
  } catch {
    return responseText.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");
  }
}
var query = process.argv[2];
if (!query) {
  console.error("Usage: search_docs.js <query>");
  process.exit(1);
}
var apiName = "pos-ui";
var startWithLegacy = process.env.USE_LEGACY_SEARCH === "true";
try {
  let result;
  try {
    result = await performSearch(query, apiName, startWithLegacy);
  } catch (firstError) {
    const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
    try {
      result = await performSearch(query, apiName, !startWithLegacy);
    } catch (retryError) {
      const retryMessage = retryError instanceof Error ? retryError.message : String(retryError);
      throw new Error(
        `Search failed on both backends.

First attempt (${startWithLegacy ? "legacy" : "new"}): ${firstMessage}

Retry (${startWithLegacy ? "new" : "legacy"}): ${retryMessage}`
      );
    }
  }
  process.stdout.write(result);
  process.stdout.write("\n");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Search failed: ${message}`);
  process.exit(1);
}
