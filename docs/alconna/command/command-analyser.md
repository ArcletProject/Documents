---
id: command-analyser
title: Alconna 前身
---

## CommandAnalysis

`Alconna` 的前身是 [`Cesloi-CommandAnalysis`](https://github.com/RF-Tar-Railt/Cesloi-CommandAnalisys)

相比 `Alconna`, `CommandAnalysis` 结构更加简单, 但遗憾的是只能解析字符串命令

```pycon
>>> from command import *
# 与上面Alconna的对比
>>> v = Command(headers=[""], main=["img", [["download", ["-p", AnyStr]], ["upload", [["-u", AnyStr], ["-f", AnyStr]]]]])
>>> v.analysis("img upload -u http://www.baidu.com")
'http://www.baidu.com'
>>> v.analysis("img upload -f img.png")
'img.png'
```

## 构造

`CommandAnalysis` 的构造方法:

```python
Command(headers=[""], main=["name", "args/subcommand/subcommand_list", "separate"])
``` 

其中
- headers: 呼叫该命令的命令头列表
- name: 命令名称
- args: 命令参数
- separate: 命令分隔符,分隔name与args,通常情况下为 " " (空格)
- subcommand: 子命令, 格式与main相同
- subcommand_list: 子命令集, 可传入多个子命令

在这里，我们将一个命令抽象为两个部分, 即 **命令头(headers)** 与 **命令主体(main)**

命令头常见的有 斜杠"/",  半角句号".",  感叹号"!",  全角句号"。"  等等，是作为区分平常语句与命令的 **唯一标识符**

命令主体也可以抽象为三个部分, 即 **名称(name)**, **参数(args)** 和 **分隔符(separate)**

> 为什么提起 CommandAnalysis？

别急，接着往下看