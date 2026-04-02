#!/usr/bin/env node

const ENDPOINT = "https://www.dajiala.com/fbmain/monitor/v3/kw_search";
const CONFIG_PATH = new URL("../.wechat-source-config.json", import.meta.url);

function printHelp() {
  console.log(`Usage:
  node scripts/wechat_source_search.mjs --kw "关键词" [options]

Options:
  --kw <text>           Search keyword, required
  --sort-type <n>       sort_type, default 1
  --mode <n>            mode, default 1
  --period <n>          period, default 7
  --page <n>            page, default 1
  --key <text>          API key, default from DAJIALA_WECHAT_KEY
  --any-kw <text>       any_kw
  --ex-kw <text>        ex_kw
  --verifycode <text>   verifycode
  --type <n>            type, default 1
  --save <path>         Save markdown summary to a file
`);
}

function parseArgs(argv) {
  const args = {
    kw: "",
    sortType: 1,
    mode: 1,
    period: 7,
    page: 1,
    key: "",
    anyKw: "",
    exKw: "",
    verifycode: "",
    type: 1,
    save: "",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === "--kw") {
      args.kw = next || "";
      i += 1;
    } else if (arg === "--sort-type") {
      args.sortType = Number(next || 1);
      i += 1;
    } else if (arg === "--mode") {
      args.mode = Number(next || 1);
      i += 1;
    } else if (arg === "--period") {
      args.period = Number(next || 7);
      i += 1;
    } else if (arg === "--page") {
      args.page = Number(next || 1);
      i += 1;
    } else if (arg === "--key") {
      args.key = next || "";
      i += 1;
    } else if (arg === "--any-kw") {
      args.anyKw = next || "";
      i += 1;
    } else if (arg === "--ex-kw") {
      args.exKw = next || "";
      i += 1;
    } else if (arg === "--verifycode") {
      args.verifycode = next || "";
      i += 1;
    } else if (arg === "--type") {
      args.type = Number(next || 1);
      i += 1;
    } else if (arg === "--save") {
      args.save = next || "";
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

async function loadConfig() {
  const fs = await import("node:fs/promises");

  try {
    const content = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

function ensureRequired(args) {
  if (!args.kw) {
    throw new Error("Missing required --kw");
  }

  if (!args.key) {
    throw new Error("Missing API key. Pass --key or set DAJIALA_WECHAT_KEY");
  }
}

function pickArray(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];

  for (const key of Object.keys(value)) {
    if (Array.isArray(value[key])) return value[key];
  }

  return [];
}

function normalizeItem(item) {
  return {
    title: item.title || item.name || item.nick_name || item.account_name || "",
    author:
      item.author ||
      item.bizname ||
      item.nickname ||
      item.nick_name ||
      item.account ||
      item.account_name ||
      "",
    url:
      item.url ||
      item.link ||
      item.content_url ||
      item.article_url ||
      item.source_url ||
      "",
    summary:
      item.summary ||
      item.digest ||
      item.abstract ||
      item.desc ||
      item.description ||
      "",
    publishTime:
      item.datetime ||
      item.publish_time ||
      item.date ||
      item.created_at ||
      "",
    raw: item,
  };
}

function toMarkdown(query, normalized, raw) {
  const lines = [
    "# 公众号检索结果",
    "",
    "来源：dajiala 公众号接口",
    `关键词：${query.kw}`,
    `检索日期：${new Date().toISOString()}`,
    `页码：${query.page}`,
    `时间范围：${query.period}`,
    "",
    "## 结果摘要",
  ];

  if (normalized.length === 0) {
    lines.push("- 无结果");
  } else {
    normalized.forEach((item, index) => {
      lines.push(`- ${index + 1}. ${item.title || "(无标题)"}`);
      if (item.author) lines.push(`  - 作者：${item.author}`);
      if (item.publishTime) lines.push(`  - 时间：${item.publishTime}`);
      if (item.url) lines.push(`  - 链接：${item.url}`);
      if (item.summary) lines.push(`  - 摘要：${item.summary}`);
    });
  }

  lines.push("");
  lines.push("## 原始返回");
  lines.push("```json");
  lines.push(JSON.stringify(raw, null, 2));
  lines.push("```");

  return `${lines.join("\n")}\n`;
}

async function main() {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const args = parseArgs(process.argv.slice(2));
  const config = await loadConfig();
  args.key = args.key || process.env.DAJIALA_WECHAT_KEY || config.key || "";
  ensureRequired(args);

  const payload = {
    kw: args.kw,
    sort_type: args.sortType,
    mode: args.mode,
    period: args.period,
    page: args.page,
    key: args.key,
    any_kw: args.anyKw,
    ex_kw: args.exKw,
    verifycode: args.verifycode,
    type: args.type,
  };

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  const text = await response.text();
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw_text: text };
  }

  const normalized = pickArray(parsed).map(normalizeItem);
  const output = {
    ok: response.ok,
    status: response.status,
    endpoint: ENDPOINT,
    query: payload,
    normalized,
    raw: parsed,
  };

  if (args.save) {
    const content = toMarkdown(payload, normalized, parsed);
    await fs.mkdir(path.dirname(args.save), { recursive: true });
    await fs.writeFile(args.save, content, "utf8");
  }

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
