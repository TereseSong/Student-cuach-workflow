# 公众号接口检索

当前 workflow 已接入一个公众号检索接口，用于在本地知识库未覆盖时优先补检索。

## 接口

- 地址：`https://www.dajiala.com/fbmain/monitor/v3/kw_search`
- 方法：`POST`
- Content-Type：`application/json`

## 适用场景

- 本地 `knowledge-base/` 没有命中
- 用户明确要求“先查公众号”
- 用户给了公众号作者名、公众号名、文章关键词

## 默认优先级

1. 先查本地 `knowledge-base/`
2. 本地没命中，先查公众号接口
3. 公众号接口仍不够，再补搜狗微信搜索或其他来源
4. 如果公众号结果后续会重复使用，整理后放进 `knowledge-base/01-项目知识库/`

## 脚本

脚本路径：

`scripts/wechat_source_search.mjs`

基础用法：

```bash
node scripts/wechat_source_search.mjs --kw "人民日报"
```

带 key：

```bash
node scripts/wechat_source_search.mjs --kw "人民日报" --key "YOUR_KEY"
```

用环境变量：

```bash
DAJIALA_WECHAT_KEY="YOUR_KEY" node scripts/wechat_source_search.mjs --kw "人民日报"
```

也可以放本地配置文件：

`./.wechat-source-config.json`

```json
{
  "key": "YOUR_KEY"
}
```

脚本会按这个顺序取 key：

1. `--key`
2. `DAJIALA_WECHAT_KEY`
3. `./.wechat-source-config.json`

保存成 markdown 备查：

```bash
DAJIALA_WECHAT_KEY="YOUR_KEY" node scripts/wechat_source_search.mjs \
  --kw "人民日报" \
  --save "knowledge-base/01-项目知识库/人民日报-公众号检索.md"
```

## 返回结果怎么用

- 先看 `normalized` 字段
- 如果只有标题和摘要，没有正文，不要把摘要当全文结论
- 如果命中结果里带文章链接，再继续抓正文
- 如果接口没命中，要明确写“公众号接口未命中”

## 回答时怎么标记

命中接口检索时，统一标记为：

`<外部参考>公众号接口检索 / 关键词</外部参考>`

如果后续又拿到了具体文章正文，正文另标为：

`<外部参考>公众号文章 / 标题或作者</外部参考>`
