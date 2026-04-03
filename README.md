# student-coach-workflow

面向训练营、航海、陪跑营、知识付费场景的学员教练工作流。

核心特点：

- 先检索本地知识库，再点评或答疑
- 默认产出 `A版 / B版` 两个草稿，方便教练挑选
- 正文优先像教练本人在群里回复，不写成资料转述
- 每次任务结束后，默认把最终采用答复沉淀进案例库，方便下次复用

## Codex 安装和接入

如果你是第一次接触 agent，推荐先在 Codex 跑通这套 workflow，再考虑 Claude Code。

最简单的完整路径只有 4 步：

1. 安装 Codex
2. 把这个 skill 放进 `~/.codex/skills/`
3. 登录并启动 Codex
4. 直接在对话里触发这个 skill

### 第 1 步：安装 Codex

```bash
npm install -g @openai/codex
```

### 第 2 步：安装这个 skill

Codex 的 skill 本质上就是本地 `~/.codex/skills/` 目录下的一套文件。

最简单装法：

```bash
mkdir -p ~/.codex/skills
cd ~/.codex/skills
git clone https://github.com/TereseSong/Student-cuach-workflow.git student-coach-workflow
```

装好后，目录应该长这样：

```text
~/.codex/skills/student-coach-workflow/
```

至少要有这些文件和目录：

- `SKILL.md`
- `README.md`
- `references/`
- `knowledge-base/`

### 第 3 步：登录并启动 Codex

最简单登录方式：

```bash
codex --login
```

如果你已经有 OpenAI API key，也可以直接配置：

```bash
export OPENAI_API_KEY="YOUR_KEY"
```

启动：

```bash
codex
```

### 第 4 步：在 Codex 里触发这个 skill

进入 Codex 后，直接说：

```text
用 student-coach-workflow 点评这条学员日志
```

你也可以这样触发：

- `先查 knowledge-base，再回答这个问题`
- `帮我提炼最近几条日志的共识问题`
- `帮我把这批资料整理进 knowledge-base`

### 如果你主要用 Claude Code

Claude Code 的安装和接入我已经单独拆到这个文件：

- [README-CLAUDE-CODE.md](/Users/teresasong/.codex/skills/student-coach-workflow/README-CLAUDE-CODE.md)

## 这个 skill 能做什么

支持这几类常见任务：

- 学员日志点评
- 学员问题答疑
- 项目知识检索
- 学员共识问题提炼
- 学员日志模板优化
- 知识入库整理
- workflow 迭代和风格修正

默认最常用的是前 3 类。

## 怎么触发

直接在对话里说，不需要记命令。

常见触发说法：

- `用 student-coach-workflow 点评这条学员日志`
- `这是学员日志，你来点评`
- `先查 knowledge-base，再回答这个问题`
- `帮我回答这个学员问题`
- `先检索项目资料，再决定怎么回`
- `帮我提炼最近几条日志的共识问题`
- `帮我优化学员日志模板`
- `帮我把这批资料整理进 knowledge-base`
- `这个点评 AI 味太重，按 workflow 调一下`

如果你直接贴出一条完整学员日志，默认就会进入“学员日志点评”模式。

## 默认输出是什么样

处理学员日志时，默认输出 `A版 / B版` 两个备选，给教练内部挑草稿。

输出原则：

- 正文优先像教练自己的判断和经验，不直接写成 `项目手册说`、`课程里讲过`
- 如果要保留依据，放在正文后单独一行补 `<知识库参考>` 或 `<外部参考>`
- 两版要有口气差异，但核心判断不能互相打架
- 动作要窄，要像学员明天真的能照着做

## 推荐使用方式

最常见的有两种：

1. 直接贴学员日志，让 skill 先检索再点评
2. 先把项目资料放进 `knowledge-base/`，再让 skill 检索后点评

如果你要长期用，建议先把课程资料、手册、答疑记录放进知识库，再开始点评，稳定性会高很多。

## knowledge-base 怎么放资料

这个 skill 默认只保留两类知识库目录：

- `knowledge-base/01-项目知识库/`
- `knowledge-base/02-答疑案例/`

### `01-项目知识库/` 放什么

放操作规则和项目资料：

- 课程资料
- 项目知识手册
- SOP
- 收藏的外部资料
- 官方资料整理
- 规则页整理

适合的文件名例子：

- `发布节奏-SOP.md`
- `低转化-常见原因.md`
- `视频号图书带货-项目手册.md`

### `02-答疑案例/` 放什么

放已验证过的话术和案例：

- 学员答疑记录
- 优秀日志
- 示范点评
- 案例拆解
- 常见问题
- 群内统一提醒

这个目录会越来越重要。后续同类任务，默认会优先复用这里已经验证过的话术和纠偏方式。

## 资料整理建议

为了让检索更稳，建议这样放：

- 文件名尽量带主题，不要全叫“笔记”“资料整理”
- 一份文件尽量只讲一个主题
- 外部资料建议在文首标注来源和日期
- 暂时分不清放哪里时，优先放 `01-项目知识库/`

如果你赶时间，最少也要做到这 3 点：

- 文件名带主题
- 文首带来源
- 正文有一级标题

## 一次典型使用流程

1. 贴一条学员日志
2. skill 先检索 `knowledge-base/`
3. 命中项目资料、案例库、SOP 后，先消化成教练判断
4. 输出 `A版 / B版` 两个点评草稿
5. 你挑一个版本，或让我继续改口气
6. 最终采用的版本回写到 `knowledge-base/02-答疑案例/`

## 项目知识不够时怎么办

默认顺序是：

1. 先查用户点名文件
2. 再查 `knowledge-base/`
3. 再查当前项目内的相关资料
4. 本地仍不足时，再补外部搜索，已经接入微信公众号信息源

也就是说，这个 skill 不是一上来就去外部搜，而是先吃本地知识。

## 外部搜索怎么接

外部搜索不是必须。

如果本地知识库已经够用，可以完全不接外部搜索源。

当前 workflow 已预留“微信公众号搜索源”接入，适合这些场景：

- 本地资料没有覆盖
- 用户明确要求“先查公众号”
- 你知道关键词、公众号名、作者名，想补检索

### 微信公众号搜索源

当前目录已经内置了公众号检索脚本：

- 脚本：`scripts/wechat_source_search.mjs`
- 接口说明参考：`references/wechat-source-search.md`

接入方式说明：

- 官网：`https://www.dajiala.com/main/interface?actnav=0`
- 需要在官网订阅 API key 并充值后使用
- 这是可选能力，不是必须能力

也就是说：

- 你不接这个源，skill 也能正常做本地知识检索和点评
- 你接了这个源，skill 在本地未覆盖时就可以优先补公众号检索

### API key 怎么提供

脚本支持 3 种方式取 key，优先级从高到低：

1. 命令行参数 `--key`
2. 环境变量 `DAJIALA_WECHAT_KEY`
3. 本地配置文件 `./.wechat-source-config.json`


在wechat-source-config.json放入你的key

配置文件示例：

```json
{
  "key": "YOUR_KEY"
}
```

## 常见任务示例

### 1. 点评学员日志

你可以直接说：

`用 student-coach-workflow 点评这条日志`

### 2. 先查资料再答疑

你可以直接说：

`先查 knowledge-base，再回答这个问题`

### 3. 提炼共识问题

你可以直接说：

`把最近几条日志的共识问题提炼出来`

### 4. 整理知识库

你可以直接说：

`帮我把这批资料整理进 knowledge-base`

## 目录说明

当前目录结构：

```text
student-coach-workflow/
├── README.md
├── SKILL.md
├── knowledge-base/
│   ├── 01-项目知识库/
│   └── 02-答疑案例/
├── references/
│   ├── router.md
│   ├── coaching-template.md
│   ├── coach-voice.md
│   ├── knowledge-base-search.md
│   ├── review-checklist.md
│   └── ...
└── scripts/
    └── wechat_source_search.mjs
```

## 使用建议

如果你是第一次用，建议按这个顺序：

1. 先把项目手册、课程资料、SOP 放进 `knowledge-base/01-项目知识库/`
2. 再把历史答疑、示范点评放进 `knowledge-base/02-答疑案例/`
3. 然后直接贴一条学员日志来点评
4. 如果本地资料不够，再决定要不要接公众号搜索源

这样效果通常最稳。
