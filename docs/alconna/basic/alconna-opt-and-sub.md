---
id: alconna-opt-and-sub
title: 选项与子命令
---

# Option

`Option` 是基础的选项类
```python
option = Option("name", key1=value1, key2=value2)
```
或
```python
option = Option("name", args=Args(key1=value1, key2=value2))
```

`Option` 需要两类参数
- name: 该 `Option`的名字，必填
- args: 该 `Option`可能的参数，选填，可用kwargs形式或`Args`

当只填写了`name`时，`Alconna`会默认该`Option`的参数为 Ellipsis (即"...")

`args`的格式为key-value, `key`是作为该参数的说明与查找的，在指令中不需要输入; `value`支持一般字符串、正则表达式与元素类型

## Alias
`Option` 可以传入alias参数，作为该option的选项别名

构造`Option`时, 以下两种方式是可用的:
```python
Option("--time", alias="-t", args=Args["sec":int])
```
与
```python
Option("--time| -t", args=Args["sec":int])
```
解析时, `--time 30` 与 `-t 30`都将被成功解析

# Subcommand

`Subcommand` 比起 `Option` 更类似于一个单独的`Command`, 当然, 没有命令头
```python
subcommand = Subcommand("name", Option("option1"), Option("option2"), key1=value1, key2=value2)
```
或
```python
subcommand = Subcommand("name", Option("option1"), Option("option2"), args=Args(key1=value1, key2=value2))
```

`Subcommand` 需要三类参数
- name: 该 `Option`的名字，必填
- options: 该`Subcommand`可能的选项，选填，可选多个
- args: 该 `Option`可能的参数，选填，可用kwargs形式或`Args`

当只填写了`name`时，`Alconna`会默认该`Subcommand`的参数为 Ellipsis (即"...")

`options` 为选项类的列表, 但注意不能嵌套`Subcommand`

`args`的格式为key-value, `key`是作为该参数的说明与查找的，在指令中不需要输入; `value`支持一般字符串、正则表达式与元素类型
