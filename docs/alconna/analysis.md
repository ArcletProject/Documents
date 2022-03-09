---
id: analysis
title: 解析部分
---

## Analyser

`Analyser` 是一个抽象类，它规定了解析`Alconna`所有需要的参数与方法.

`Analyser` 之于 `Alconna`, 就好比`re.Pattern` 之于 `str`.

`Alconna` 默认使用`DisorderAnalyser`来解析参数. 你也可以构造一个自己的`Analyser`来解析参数.

## 获取

`Analyser` 可以通过两种方式获取:
1. 使用`analysis.compile`方法获取, 该方法会实时生成一个`Analyser`实例.
2. 使用`command_manager.require`方法获取, 该方法会获取命令创建的同时生成的`Analyser`实例.

## 方法
### `add_arg_handler`

该方法用来注册一个ArgPattern的处理器.


### `handle_message`

该方法用来实际处理接受到的消息

当解析成功时, 该方法无返回值;

解析失败时, 若`Alconna`的`is_raise_exception`为`True`, 则会抛出异常;
否则会返回携带报错信息的`Arpamar`对象.

## Analyse Parts

`alconna.analysis`中提供了四类方法:
- analyse_args: 直接解析一个`Args`对象
- analyse_option: 直接解析一个`Option`对象
- analyse_subcommand: 直接解析一个`Subcommand`对象
- analyse_header: 直接解析`headers`列表

该类方法默认直接报错