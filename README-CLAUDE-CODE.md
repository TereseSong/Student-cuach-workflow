# student-coach-workflow for Claude Code

这份说明专门给 Claude Code 用户。

如果你主要用 Codex，请看主文件：

- [README.md](/Users/teresasong/.codex/skills/student-coach-workflow/README.md)

如果你主要用 Claude Code，就按这份来。

## 先说结论

Claude Code 没有和 Codex 完全一样的 `~/.codex/skills/` 原生技能目录机制。

最稳的接法不是“把它装成 Claude 原生 skill”，而是：

1. 先安装 Claude Code
2. 把这个仓库 clone 到本地
3. 用 `CLAUDE.md` 告诉 Claude 什么时候读取这套 workflow
4. 如果想更顺手，再加一个自定义 slash command

## 最简单安装版

### 1. 安装 Claude Code

官方最简单安装方式：

```bash
npm install -g @anthropic-ai/claude-code
```

启动：

```bash
claude
```

首次进入后按提示登录即可。

参考来源：

- Anthropic Docs: Claude Code setup
- Anthropic Docs: Claude Code slash commands

## 怎么把这个 workflow 接进 Claude Code

### 方式 1：最推荐，`CLAUDE.md` 方式

这也是最容易理解、最不容易搞错的方式。

先把仓库 clone 到本地：

```bash
git clone https://github.com/TereseSong/Student-cuach-workflow.git ~/skills/student-coach-workflow
```

进入你自己的项目目录：

```bash
cd /你的项目目录
claude
```

在 Claude Code 里先执行：

```text
/init
```

这样 Claude Code 会帮你初始化一个 `CLAUDE.md`。

然后在项目里的 `CLAUDE.md` 里加上类似这段：

```md
When the task is about student coaching, learner logs, coaching feedback, knowledge-base search, cohort support, or training-camp operations:

1. Read `~/skills/student-coach-workflow/README.md`
2. Read `~/skills/student-coach-workflow/SKILL.md`
3. Follow that workflow before answering
```

如果你希望 Claude 连知识库目录也一起参考，可以再补一句：

```md
Also check:

- `~/skills/student-coach-workflow/knowledge-base/`
- `~/skills/student-coach-workflow/references/`
```

### 方式 2：更顺手，自定义 slash command

如果你希望在 Claude Code 里更像“一个命令触发”，可以再加自定义命令。

Anthropic 官方支持把 Markdown 文件放进：

- 项目级：`.claude/commands/`
- 用户级：`~/.claude/commands/`

如果你想全局可用，最简单是建用户级目录：

```bash
mkdir -p ~/.claude/commands
```

新建文件：

```text
~/.claude/commands/student-coach.md
```

写入：

```md
Use the workflow in `~/skills/student-coach-workflow/README.md` and `~/skills/student-coach-workflow/SKILL.md`.

If the task is about learner logs, coaching feedback, knowledge-base search, or community coaching:

1. Read the workflow files first
2. Check local knowledge before answering
3. Produce coach-style output instead of generic summary

Task:
$ARGUMENTS
```

之后在 Claude Code 里直接用：

```text
/student-coach 点评这条学员日志
```

或者：

```text
/student-coach 先查 knowledge-base，再回答这个学员问题
```

## 怎么放资料

如果你想让 Claude Code 也能用这套知识库，建议继续沿用这个目录结构：

```text
~/skills/student-coach-workflow/
├── knowledge-base/
│   ├── 01-项目知识库/
│   └── 02-答疑案例/
```

放法和主 README 一样：

- `01-项目知识库/` 放课程资料、手册、SOP、规则页、外部整理资料
- `02-答疑案例/` 放优秀日志、答疑记录、示范点评、案例拆解、共识提醒

## Claude Code 里怎么触发

最简单的说法：

- `请按 student-coach-workflow 点评这条学员日志`
- `先读 ~/skills/student-coach-workflow/SKILL.md，再回答这个问题`
- `/student-coach 点评这条学员日志`

## 微信公众号搜索源怎么接

这部分和主 README 一样，属于可选能力，不是必须。

如果你本地资料不够，想让 Claude Code 也能补公众号检索：

- 官网：`https://www.dajiala.com/main/interface?actnav=0`
- 需要你先订阅 API key 并充值
- 这不是必须能力，不接也不影响本地知识检索和点评

本地脚本在：

- `scripts/wechat_source_search.mjs`

## 最后建议

如果你完全是新手，我还是建议：

1. 先在 Codex 跑通一次这套 workflow
2. 再回到 Claude Code 接 `CLAUDE.md` 或 slash command

这样你会更容易理解这套 workflow 到底是怎么工作的。
