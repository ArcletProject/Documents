---
id: koishi-like
title: Koishi-like 方式
---

## 实例化

:::note

该方法来源于 [Koishi 指令系统](https://koishi.js.org/guide/command/command.html)
中命令的创建方式。

:::

`Alconna` 的koishi-like形式的构造方法, 如
```python
from arclet.alconna import Alconna
Alconna.set_custom_types(digit=int)
alc = Alconna.from_string(
     "[tt|test_type] <wild> <text:str> <num:digit> <boolean:bool:False> #测试命令",
     "--foo|-f [True]"
)
```

它与如下是等效的:
```python
from arclet.alconna import Alconna, Option, store_bool, Args, AnyParam
alc = Alconna(
    headers=["tt", "test_type"],
    options=[
        Option("--foo", alias='-f', actions=store_bool(True))
    ],
    main_args=Args["wild":AnyParam, "text":str, "num":int, "boolean":bool:False]
)
```

该方法需要三类参数:
- `command` 主命令, 包含命令名称与主参数
- `options` 命令选项
- `custom_types` 自定义类型

:::tip

`Alconna.set_custom_types` 可以用来设置全局的自定义类型,

:::

## 编写规则

字符串中首个部分一定是命令名称, 后面的内容是参数的类型或帮助信息,

对于主命令, 需要通过`[nameA|nameB]`的形式来指定主命令的多项命令名称; 对于命令选项, 需要通过`name|alias`的形式来指定选项的名称与别名,

`<xxx>`代表参数, 如`<value:int>`等价于`Args['value':int]`, `<message>`等价于`Args['message':AnyParam]`

:::caution 注意!

如果写入了`<...xxx>`, 此参数表示该处为 `AllParam`, 会截断之后的解析操作

:::

针对option, `[xxx]`参数代表`store_val(xxx)`的`action`

`#xxx` 代表该命令节点的帮助信息, 若不写入则默认帮助信息为命令名