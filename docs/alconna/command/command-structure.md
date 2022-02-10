---
id: command-structure
title: 命令结构
---

## Structure

我们假设一条命令为
```
sdist upload -r pypi
```

当我们以json结构去表示这个命令时, 有大致两种结构

a:
```json5
{
  "main": {
    "name": "sdist",
    "separate": " ",
    "args": [
      " _upload_ "
    ]
  },
  "separate": " ",
  "subcommand": [
    {
      "name": "-r",
      "separate": " ",
      "args": " %pypi% "
    }
  ]
}
```
b:
```json5
{
  "name": "sdist",
  "separate": " ",
  "args": [
    {
      "name": "upload",
      "separate": " ",
      "args": [
        {
          "name": "-r",
          "separate": " ",
          "args": " %pypi% "
        }
      ]
    }
  ]
}
```

:::note 参数说明

`"_upload_"`, 下划线表示该处为`single-str-match`, 即参数只能为 **指定字符串**

`"%pypi%"`, 百分号表示该处为`any-str-match`, 即参数可以为 **任意字符串**

:::

显然的是，第一种结构的层数更少，第二种结构的拓展性更好

而 `CommandAnalysis` 正是根据第二种结构实现的命令解析

以常见命令 `/ping 127.0.0.1` 为例, 

`/`是命令头, `ping`是命令名称, ` `是命令分隔符, `127.0.0.1`是命令参数

以json表示就是
```json5
{
  "header": "/",
  "main": {
    "name": "ping",
    "separate": " ",
    "args": "127.0.0.1"
  }
}
```

那么怎么转换成可以让解析器解析的命令呢？

只需要这么写:

```python
Command(headers=["/"], main=["ping", AnyIP])
```
AnyIP 其实是预制的正则表达式。是的，在`CommandAnalysis` 中, 你可以在任意地方写入自己的正则表达式。

:::tip

读完这些，你应该对 **命令(Command)** 的结构有一个大致的了解, 这也是为后面你学习的 `Alconna` 做功课

:::

接下来, 便是对于 `Alconna` 的详细介绍了