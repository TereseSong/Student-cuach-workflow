---
name: student-coach-workflow
description: Build and use a local-knowledge-first coaching workflow for training camps, cohorts, paid communities, and coaching programs. Use when Codex needs to answer learner questions, review learner action logs, extract guidance from a project knowledge base before answering, produce evidence-backed coaching comments, or create/update a reusable skill for this coaching scenario.
---

# 通用学员教练工作流

将本技能作为“本地知识优先、项目检索先行、点评有据可查、回复口语化”的教练工作流运行，而不是单条点评提示词。

默认场景为 `训练营/航海/知识付费学员行动日志点评`。如用户任务不是点评，而是查项目知识、回答学员问题、整理知识库或维护 skill，先路由再执行。

## 安装后怎么用

第一次打开时，优先看 `references/welcome.md`。

装好以后，用户不需要记复杂命令，直接在对话里这样说就行：

- `用 student-coach-workflow 点评这条学员日志`
- `先检索知识库，再回答这个学员问题`
- `帮我优化学员日志模板`
- `帮我整理这批资料，放进 knowledge-base`

如果用户直接贴出一条完整学员日志，也默认按“学员日志点评”处理。

第一次使用，最推荐这两种方式：

1. 直接贴学员日志，让 skill 产出 `A版 / B版` 两个点评备选
2. 先把课程、项目知识手册、收藏的知识放进 `knowledge-base/01-项目知识库/`，把答疑和案例放进 `knowledge-base/02-答疑案例/`，再让 skill 去检索后点评

常见触发说法可以参考：

- `这是学员日志，你来点评`
- `先查项目资料，再回这个问题`
- `这批答疑记录帮我整理进知识库`
- `这个点评太空了，按知识库重写`

## 先做入口路由

1. 先读 `references/router.md`，判断当前任务属于哪一种模式。
2. 命中模式后，只加载该模式需要的引用文件，避免把整套资料一次性读入。
3. 如用户同时要求“先查知识再点评”，按 `项目知识检索 -> 点评生成` 顺序执行。

## 选择入口

按任务场景只加载需要的引用文件：

- 学员行动日志点评：读 `references/router.md`、`references/knowledge-base-search.md`、`references/coaching-template.md`、`references/review-checklist.md`、`references/coach-voice.md`、`references/self-evolution.md`、`references/consensus-extraction.md`
- 学员问题解答：读 `references/router.md`、`references/knowledge-base-search.md`、`references/coaching-template.md`、`references/self-evolution.md`
- 项目知识检索或知识问答：读 `references/router.md`、`references/knowledge-base-search.md`
- 如果用户要求增加或指定外部信息源：额外读 `references/source-priority.md`、`references/wechat-source-search.md`
- 复制即用提示词：读 `references/prompt-template.md`、`references/student-log-template.md`
- 学员日志模板或提交流程优化：读 `references/student-log-template.md`、`references/review-checklist.md`
- 知识入库或资料整理：读 `references/knowledge-ingestion.md`
- 共识问题提炼：读 `references/router.md`、`references/knowledge-base-search.md`、`references/coaching-template.md`、`references/review-checklist.md`、`references/coach-voice.md`、`references/self-evolution.md`、`references/consensus-extraction.md`
- 自我进化接入或工作流迭代：读 `references/self-improvement-integration.md`，再按需要补读 `references/self-evolution.md`、`references/coach-voice.md`、`references/coaching-template.md`、`references/review-checklist.md`
- 维护或升级本 skill：先审阅 `SKILL.md` 与已有关联引用文件，再只补缺失部分

## 执行契约

1. 任何点评、答疑或建议输出前，必须先检索本地知识库、项目文件或用户点名文件。
2. 区分 `知识库已覆盖`、`项目资料部分覆盖`、`本地资料未覆盖` 三种情况，不得混写。
3. 学员日志默认提取三类信号：`【待解答】`、`【待延伸】`、`【待确认】`。
4. 输出必须优先回答学员显式问题，再补动作建议和风险提醒。
5. 每个关键判断尽量附 `<知识库参考>...</知识库参考>`，引用真实文件名、标题或稳定定位。
6. `知识库参考`、`外部参考` 必须独立分行输出，不能和正文写在同一段里。
7. 如果本地资料未覆盖，必须先按“项目指定来源 -> 官方资料 -> 高质量外部来源”的顺序补检索，再输出结论；仍未覆盖时才给低置信度的通用建议。
8. 默认输出中文。处理学员行动日志时，默认一次生成 `2` 版教练点评，方便教练挑选；每版控制在 `180-320` 字，风格应像群内教练语音转文字，口语化、直接、能落地。
9. 点评生成后，必须再过一遍 `references/review-checklist.md`，避免漏答问题、建议太虚或鼓励太空。
10. 点评口气默认参考 `references/coach-voice.md`，优先学习“先纠偏、再给动作、保留判断感”的说话方式，不要写成中性 AI 总结。
11. 点评、答疑、群发共识提醒在最终输出前，必须执行一次“去 AI 味复检”，优先按 `references/coaching-template.md` 的“去 AI 味硬规则”和 `references/review-checklist.md` 的“风格检查 / 禁词检查”删改。
12. 每次输出最终采用的答复后，必须把本次任务的关键信息和最终答复沉淀到 `knowledge-base/02-答疑案例/`，并按 `references/self-evolution.md` 提炼一条可复用规则，作为下次同类任务的优先参考。
13. 每次完成学员日志点评后，默认补一句简短确认，询问用户是否要基于最近几条日志继续提炼“圈友共识问题和统一建议”。
14. 涉及工作流升级、自我进化、风格修正时，默认按 `references/self-improvement-integration.md` 的最小接入方案执行，只允许轻量沉淀，不默认进入重自动化。

## 本地知识优先级

检索顺序固定如下：

1. 用户当前消息点名的文件、文件夹、知识库
2. 当前 skill 下的 `knowledge-base/` 目录
3. 当前项目中的知识库、SOP、课程笔记、答疑记录、复盘、案例、作业示范、运营文档
4. 与学员日志关键词强相关的其他项目文件
5. 若本地资料仍不足，再按项目主题选择外部来源优先级：
   - 用户明确指定的链接、站点、官方文档
   - 用户明确指定的信息源白名单，例如 `搜狗微信搜索 / 公众号`
   - 已接入的信息源接口，例如 `公众号接口检索`
   - 与主题最贴近的官方文档、产品文档、规则页、发布说明
   - 高质量社区讨论、案例文章、行业资料
6. 若外部资料仍不足，再给行业通用建议，并明确说明未被本地知识验证

不要跳过前四层，直接用泛化经验作答。

## knowledge-base 目录约定

默认知识库目录为当前 skill 下的 `knowledge-base/`，只保留两类：

- `knowledge-base/01-项目知识库/`：课程、项目知识手册、收藏的知识、SOP、外部整理资料
- `knowledge-base/02-答疑案例/`：答疑记录、优秀日志、案例拆解、示范点评、常见问题

用户上传资料时，优先按这两类放，不再细拆更多文件夹。

## 资料放哪里

如果用户装好 skill 后要开始喂资料，默认放这里：

- `knowledge-base/01-项目知识库/`
  放课程、项目知识手册、收藏的知识、SOP、外部整理资料
- `knowledge-base/02-答疑案例/`
  放答疑记录、优秀作业、优秀日志、案例拆解、示范点评、常见问题

最小使用建议：

- 课程、项目知识手册、收藏的知识，统一放 `knowledge-base/01-项目知识库/`
- 答疑记录、案例、优秀日志、示范点评，统一放 `knowledge-base/02-答疑案例/`
- 分不清时，优先放 `knowledge-base/01-项目知识库/`，后面再挪

## 默认工作流

1. 按 `references/router.md` 判断是 `点评模式`、`答疑模式`、`检索模式` 还是 `技能维护模式`。
2. 用 `references/knowledge-base-search.md` 执行文件名检索、标题检索、关键词检索和证据定位。
3. 做点评时，先从日志里提取：
   - `【待解答】` 学员明确提出的问题
   - `【待延伸】` 学员已经打算继续做的动作
   - `【待确认】` 学员自述的经验、避坑或判断
4. 将三类信号逐条匹配到本地知识证据；匹配不到的单独标记。
5. 用 `references/coaching-template.md` 生成最终点评。默认一次产出两版：
   - `A版`：更直接，像教练当场拍板，短、准、少安慰
   - `B版`：更陪跑，先接情绪，再给动作，但不许变鸡汤
   - 引用排版：正文一段，空一行，再单独一行输出 `<知识库参考>...</知识库参考>` 或 `<外部参考>...</外部参考>`
6. 用 `references/review-checklist.md` 做一次质检，重点检查：有没有答到问题、有没有给到明天能执行的动作、有没有空泛鼓励。
7. 用 `references/self-evolution.md` 做收尾：去 AI 味复检、落库最终答复、补一条迭代规则。
8. 结束前补一句确认：是否需要继续提炼最近几条日志里的共识问题和统一建议。
9. 若用户要“先查项目知识，再回答我”，先输出检索结论，再决定是否进入点评阶段。
10. 若用户要求“优化 workflow / 自我进化 / 从这次经验里学习”，先完成当前任务，再按 `references/self-improvement-integration.md` 判断是否新增 1 条规则，以及是否只更新 1 个引用文件。

## 项目知识检索要求

- 检索目标不是“找几句相关的话”，而是找可执行规则、SOP、案例、复盘结论和反例。
- 优先打开最相关片段，不整篇灌入上下文。
- 如果多个文件冲突，优先：
  1. 用户明确指定的资料
  2. `knowledge-base/01-项目知识库/` 中更新的操作型资料
  3. 更具体、更可执行的文件
  4. 外部来源中更贴近当前项目主题、且表述更完整的内容
- 若学员计划和知识库冲突，必须明确写出“这一步和知识库建议不一致，建议改为……”

## 外部来源补检索要求

- 仅当本地知识库和项目资料未覆盖、或覆盖明显不足时，才进入外部来源补检索。
- 外部来源的优先级固定为：`用户指定来源 -> 用户指定信息源白名单 -> 已接入的信息源接口 -> 官方文档/规则页 -> 高质量行业资料/社区案例`。
- 如果用户已经指定优先信息源，先读 `references/source-priority.md`，再按里面的来源顺序检索。
- 如果本地知识库没覆盖，且主题适合公众号来源，默认先尝试 `references/wechat-source-search.md` 里的公众号接口。
- 外部资料只能作为补充证据，不能覆盖本地 SOP 的明确结论。
- 若外部来源之间互相冲突，优先保守表达，并标记为“外部经验，待项目内验证”。

## 学员日志输入要求

- 推荐优先使用 `references/student-log-template.md` 中的日志模板收集学员输入。
- 理想日志至少包含：
  1. 今天做了什么
  2. 遇到了什么问题
  3. 发现了什么避坑点
  4. 明天准备做什么
  5. 如果有数据，补关键结果数据
- 如果学员日志信息太少，点评时要先明确“日志信息不足，以下建议基于当前已知信息”。

## 知识入库要求

- 新上传的课程资料、训练营资料、项目知识手册、收藏资料、答疑记录、案例文档，优先按 `references/knowledge-ingestion.md` 整理后再放入 `knowledge-base/`。
- 如果时间不够，至少保证文件名有主题、文首有来源和日期、正文有一级标题。
- 外部来源整理回来的内容，如果暂时不细分，也直接放进 `knowledge-base/01-项目知识库/`。

## 交付标准

最终输出前至少满足：

1. 已说明当前任务模式
2. 已完成本地检索，而不是直接泛答
3. 已列出命中的知识依据，或明确写出本地未覆盖 / 外部补充覆盖
4. 点评时至少覆盖五段结构中的三段，并优先覆盖显式问题
5. 鼓励总结必须绑定学员已完成的具体动作，不能空泛夸奖
6. 如用户要求项目知识检索，需先给“检索到什么/没检索到什么/下一步该看什么”
7. 输出语气默认像教练在群里直接回复学员，不写成公文，不堆术语
8. 如果学员日志信息不足，已明确指出信息缺口，而不是假装看懂了全部上下文
9. 学员日志点评默认输出 `A版 / B版` 两个备选，不只给一版
10. 产出后已完成案例沉淀，后续同类问题可直接复用，不必每次从零总结

## 迭代规则

输出不理想时，不要直接重写整段点评，优先排查：

1. 入口模式是否判错
2. 本地知识是否没检索到位
3. 证据引用是否过泛，没定位到真实标题或文件
4. 学员问题、动作、避坑三类信号是否漏提
5. 点评是否变成泛泛建议，没有结合学员当天动作
6. 语气是否太书面，不像聊天回复
7. 学员日志本身是否缺关键字段，导致点评只能泛答
8. 上一次同类案例有没有落到 `knowledge-base/02-答疑案例/`，当前回答是否复用了已验证的话术或纠偏方式

## 执行备注

- 用户要求升级本 skill 时，直接修改 skill 文件，而不是只给建议。
- 用户要求处理学员日志时，先在当前项目里做检索，再写点评。
- 用户要求“检索项目知识”时，可以只做检索摘要，不强制输出点评。
- 用户要补项目资料时，优先引导其放入 `knowledge-base/`，这样后续检索稳定性最高。
- 用户要求点评、答疑、汇总共识问题时，如果这次产生了可复用答复，默认同步写入 `knowledge-base/02-答疑案例/`。
