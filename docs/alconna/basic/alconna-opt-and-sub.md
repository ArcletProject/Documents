---
id: alconna-opt-and-sub
title: 选项与子命令
---

:::tip

`Option` 和 `Subcommand` 都继承于[`TemplateCommand`](./alconna-template-command.md)

:::

## Option

`Option` 是基础的选项类

```python
from arclet.alconna.component import Option, Args
option = Option("name", args=Args["key1":"value1", "key2":"value2"])
```

`Option` 需要两类主要参数
- name: 该 `Option`的名字，必填
- args: 该 `Option`可能的参数，选填，可用`Args`或kwargs形式(不推荐)

当只填写了`name`时，`Alconna`会默认该`Option`的参数为 Ellipsis (即"...")

### Alias
`Option` 可以传入alias参数，作为该option的选项别名

构造`Option`时, 以下两种方式是可用的:
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

```python
from arclet.alconna.component import Option, Args, Subcommand
subcommand = Subcommand("name", Option("option1"), Option("option2"), args=Args["key1":"value1", "key2":"value2"])
```

`Subcommand` 需要三类主要参数
- name: 该 `Option`的名字，必填
- options: 该`Subcommand`可能的选项，选填，可选多个
- args: 该 `Option`可能的参数，选填，可用`Args`或kwargs形式(不推荐)

当只填写了`name`时，`Alconna`会默认该`Subcommand`的参数为 Ellipsis (即"...")

`options` 为选项类的列表, 但注意不能嵌套`Subcommand`
