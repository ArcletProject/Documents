---
id: format
title: Formatter 方式
---

## 实例化
`Alconna` 的formatter形式的构造方法:

```python
from arclet.alconna import Alconna, Args
alc = Alconna.format(
    "lp user {target} perm set {perm} {value}",
    {"target": str, "perm": str, "value": Args["value":bool:True]}
)
```

它与如下是等效的:
```python
from arclet.alconna import Alconna, Subcommand, Option, Args
alc = Alconna(
    command="lp",
    options=[
        Option("user", Args["target":str]),
        Subcommand(
            "perm",
            Option("set", Args["perm":str]),
            args=Args["value":bool:True]
        )
    ]
)
```

该方法需要两类参数：
- format_string: 字符串格式
- format_args: 对应的参数

## 编写规则

`format_string` 的首个部分一定是命令名称, 后面的内容是参数或者选项或者子命令 , 
其需要使用 `{}` 来指定参数，并且标识符必须与 `format_args` 中的参数名称一致。

`format_args` 必须为字典类型, 其中的键名必须与 `format_string` 中的参数名称一致。

其值可以是Args类型, ArgPattern类型, 甚至是`Option`类型, `Alconna`会依据前后关系自动划分实际类型 