---
id: koishi-like
title: Koishi-like 方式
---

## 实例化

:::info

该方法来源于 [Koishi 指令系统](https://koishi.js.org/guide/command/command.html)
中命令的创建方式。

:::

`Alconna` 的koishi-like形式的构造方法, 如
```python
from arclet.alconna import AlconnaString
digit=int
alc = AlconnaString(
     "[tt|test_type] <text:str> <..wild> <num:digit> <boolean:bool:False> #测试命令",
     "--foo|-f [bar] &True"
)
```

它与如下是等效的:
```python
from arclet.alconna import Alconna, Option, store_value, Args, AnyParam
alc = Alconna(
    headers=["tt", "test_type"],
    options=[
        Option("--foo", Args["bar;O":str], alias=['-f'], action=store_value(True))
    ],
    main_args=Args["text":str, "wild":AnyParam, "num":int, "boolean":bool:False]
)
```

该方法需要三类参数:
- `command` 主命令, 包含命令名称与主参数
- `options` 命令选项
- `custom_types` 自定义类型

:::tip

`Alconna.set_custom_types` 可以用来设置全局的自定义类型.

在v0.7.1中, `AlconnaString`会直接读取本地的类型变量, 并且会自动添加到`custom_types`中.

:::

## 编写规则

字符串中首个部分一定是命令名称, 后面的内容是参数的类型或帮助信息,

对于主命令, 需要通过`[nameA|nameB]`的形式来指定主命令的多项命令名称; 对于命令选项, 需要通过`name|alias`的形式来指定选项的名称与别名,

`<xxx>` 代表参数, 如`<value:int>`等价于`Args['value':int]`, `<message>`等价于`Args['message':str]`

`[xxx]` 代表该参数为可选参数, 等价于 `<xxx;O>`, 具体参考 [可选参数](../basic/alconna-args.mdx#optional-args)

`#xxx` 代表该命令节点的帮助信息, 若不写入则默认帮助信息为命令名
:::caution 注意!

`<..xx>` 参数表示该处为 `AnyParam`, `<...xxx>` 参数表示该处为 `AllParam`

而 `AllParam` 参数一旦解析成功, 其会截断之后的解析操作

:::

针对option, `&xxx` 代表 `store_val(xxx)` 的 `action`

