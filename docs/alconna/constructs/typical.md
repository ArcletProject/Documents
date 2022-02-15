---
id: typical
title: 标准方式
---

## 实例化

首先，你需要把你设想的命令转化为一个[命令结构](../command/command-structure.md)，

:::tip

在将来, 你可以通过commandline功能提供的命令行工具来自动生成命令结构。

:::

依据这个命令结构，你可以逐步构建你的 Alconna 了。

```
Alconna(
    header,
    command,
    options,
    main_args,
    exception_in_time
    actions
    order_parse
    namespace

)
```


标准方法需要四大类参数：

### headers

呼叫命令的命令头，一般是你的机器人的名字或者某个符号，其位置应处于整个命令的最前面, 例如: '/', '!'

与 `command` 至少有一个填写. 

```python {3}
from arclet.alconna import Alconna, Option, Subcommand, Args
alc = Alconna(
    headers=['/', '!'],
    command='hello',
    options=[
       Option("--name|-n", Args["name": str]),
       Subcommand("world") 
    ],
    main_args=Args["reply": str],
)
```

:::note

在 v0.5.3 中, 命令头支持传入非文本消息, 例如: ```At(123456)```

:::

### command

命令名称，你的命令的名字, 会作为该命令的主要标识符, 可以包含数字、字母、下划线、短横线甚至中文字符，
但不应该包含空格或者你选定的`separator`, 例如: 'command', '你好', 'ping'

与 `headers` 至少有一个填写

```python {4}
from arclet.alconna import Alconna, Option, Subcommand, Args
alc = Alconna(
    headers=['/', '!'],
    command='hello',
    options=[
       Option("--name|-n", Args["name": str]),
       Subcommand("world") 
    ],
    main_args=Args["reply": str],
)
```

### options

命令选项，你的命令可选择的所有`option`, 是一个包含 `Subcommand` 与 `Option` 的列表

```python {5-8}
from arclet.alconna import Alconna, Option, Subcommand, Args
alc = Alconna(
    headers=['/', '!'],
    command='hello',
    options=[
       Option("--name|-n", Args["name": str]),
       Subcommand("world") 
    ],
    main_args=Args["reply": str],
)
```

:::tip

如果你开启了 `order_parse`, 那么 `options` 内各个组件的顺序会决定你命令能否成功解析.

:::

### main_args

命令主参数, 应当为一个[`Args`](../basic/alconna-args.md)类型的实例. 

若填入，则仅当命令中含有该参数时才会成功解析

```python {9}
from arclet.alconna import Alconna, Option, Subcommand, Args
alc = Alconna(
    headers=['/', '!'],
    command='hello',
    options=[
       Option("--name|-n", Args["name": str]),
       Subcommand("world") 
    ],
    main_args=Args["reply": str],
)
```

另外，你可以：
- 通过 `exception_in_time` 参数来控制是否在解析失败时抛出异常.其默认值为 `False`
- 通过 `actions` 参数来指定命令解析后的回调函数.
- 通过 `order_parse` 参数来控制是否按照命令顺序解析.其默认值为 `False`.
- 通过 `namespace` 参数来指定命令命名空间.其默认为`Alconna`.


