---
id: alconna-pattern
title: 参数表达式
---

## ArgPattern
`ArgPattern`是用来辅助参数解析工作的类, 你可以在`alconna.types`中找到.

`ArgPattern`有如下参数:

* pattern: 该参数的正则解析表达式
* token: 该参数解析时的匹配类型
* transform_action: 该参数进行类型转换的函数(如果transform为真)
* type_mark: 针对`TemplateCommand`的`Action`的类型检查 (应与解析后的最终结果的类型相符合)

例如:
```python
from arclet.alconna.types import ArgPattern, PatternToken
test_type = ArgPattern(
    r"(.+\.?.*?)",
    token=PatternToken.REGEX_TRANSFORM,
    type_mark=list,
    transform_action=lambda x: x.split(".")
)
```

该`test_type`的意思是
* 在解析时用`(.+\.?.*?)`作为正则解析
* 需要正则匹配并且进行类型转换
* 若相应的`Arg`会传入`Action`中, 在类型检查时该`Arg`的type-hint应为`list`
* 针对该`Arg`的类型转换函数 (str -> list)

```python
>>> alc = Alconna(
... command="test",
... main_args=Args["foo":test_type]
... )
>>> alc.analyse_message("test arclet.alconna").foo
['arclet', 'alconna']
```

:::tip

实际上, 上述的`test_type`可以简化为利用`action`进行类型转换:

```python
>>> alc = Alconna(
... command="test",
... main_args=Args["foo":str],
... actions=lambda x: x.split(".")
... )
>>> alc.analyse_message("test arclet.alconna").foo
['arclet', 'alconna']
```

:::


## 正则匹配

`Alconna` 提供了一些预制的`ArgPattern`, 通常以 "Any" 打头

您可以在`alconna.types`里找到它们:
- AnyStr: 任意字符
- AnyDigit: 任意整数
- AnyFloat: 任意浮点数
- AnyIP: 任意ip
- AnyUrl: 任意链接
- Bool: `"True"`或`"False"`
- Email: 任意邮件地址

:::caution

> 请尽量不要在`option`与`subcommand`的`name`里填入表达式

:::