---
id: alconna-opt-and-sub
title: 选项与子命令
---

`Option` 和 `Subcommand` 都继承于[`CommandNode`](./alconna-command-node.md),
所以它们都可以接受如下参数:

- name
- args
- action
- separator
- help_text

## Option

`Option` 是基础的选项类

```python
from arclet.alconna.component import Option, Args
option = Option("name", args=Args["key1":"value1", "key2":"value2"])
```

`Option` 可以传入`alias`参数，作为该option的选项别名

构造`Option`时, 可以用以下两种方式传入alias:
```python
from arclet.alconna.component import Option, Args
Option("--time", alias="-t", args=Args["sec":int])
```
与
```python
from arclet.alconna.component import Option, Args
Option("--time| -t", args=Args["sec":int])
```
解析时, `--time 30` 与 `-t 30`都将被成功解析

## Subcommand

`Subcommand` 比起 `Option` 更类似于一个单独的`Command`, 当然, 没有命令头

`Subcommand` 可以传入`options`参数, 作为该`Subcommand`的选项

```python
from arclet.alconna.component import Option, Args, Subcommand
subcommand = Subcommand(
    "name", 
    options=[Option("option1"), Option("option2")], 
    args=Args["key1":"value1", "key2":"value2"]
)
```

