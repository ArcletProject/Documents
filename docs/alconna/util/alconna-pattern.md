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
* origin_type: 针对`TemplateCommand`的`Action`的类型检查 (应与解析后的最终结果的类型相符合)
* alias: 该参数在检查列表的别名

例如:
```python
from arclet.alconna.types import ArgPattern, PatternToken, set_converter
test_type = ArgPattern(
    r"(.+\.?.*?)",
    token=PatternToken.REGEX_TRANSFORM,
    origin_type=list,
    converter=lambda x: x.split("."),
    alias="test"
)
set_converter(test_type)
```

或

```python
from arclet.alconna import pattern, set_converter


@pattern("test", r"(.+\.?.*?)")
def test_type(x):
    return x.split(".")

set_converter(test_type)
```

该 `test_type` 的意思是
* 在解析时用 `(.+\.?.*?)` 作为正则解析
* 需要正则匹配并且进行类型转换
* 若相应的 `Arg` 会传入 `Action` 中, 在类型检查时该 `Arg` 的type-hint应为 `list`
* 针对该 `Arg` 的类型转换函数 (str -> list)
* 在 `Args` 中可用 `test` 代表该类型

```python
>>> alc = Alconna(
... command="test",
... main_args=Args["foo":'test']
... )
>>> alc.parse("test arclet.alconna").foo
['arclet', 'alconna']
```

:::note

实际上, 上述的 `test_type` 可以简化为利用 `action` 进行类型转换:

```python
>>> alc = Alconna(
... command="test",
... main_args=Args["foo":str],
... action=lambda x: x.split(".")
... )
>>> alc.parse("test arclet.alconna").foo
['arclet', 'alconna']
```

:::


## 正则匹配

`Alconna` 提供了一些预制的 `ArgPattern`, 通常以 "Any" 打头

您可以在 `alconna.types` 里找到它们:
- AnyStr: 任意字符
- AnyDigit: 任意整数
- AnyFloat: 任意浮点数
- AnyIP: 任意ip
- AnyUrl: 任意链接
- Bool: `"True"`或`"False"`
- Email: 任意邮件地址
- AnyList: 任意列表
- AnyTuple: 任意元组
- AnyDict: 任意字典
- AnySet: 任意集合
- AnyHex: 任意十六进制数
- HexColor: 6位十六进制数表示的RGB颜色

:::caution

> 请尽量不要在`option`与`subcommand`的`name`里填入表达式

:::

## ObjectPattern

`ObjectPattern`是用来辅助对象解析工作的类, 你可以在`alconna.types`中找到.

`ObjectPattern`有如下参数:

* origin: 该参数的原始类型
* limit: 指定origin初始化时需要的参数名称, 不填则不限制
* head: 是否需要匹配一个头部, 默认不需要
* flag: 传入的参数形式, 目前有 'part', 'http' 与 'json' 三种, 默认为 'part'
* suppliers: 未知参数的提供函数/处理函数

假设我们有一个类`Test`:
```python
class Test:
    def __init__(self, a: int, b: str = "b"):
        self.a = a
        self.b = b
```
如下是不同的`ObjectPattern`:
```python
from arclet.alconna.types import ObjectPattern
obj1 = ObjectPattern(Test, limit=("a", ), flag="http")
obj2 = ObjectPattern(Test, head="test", a=lambda x: 2*x)
```
其中

`obj1` 表示:
- 构造 Test 时只传入 'a'
- 匹配的格式为 `http`, 即 `{head}?{key1}={var1}&{key2}={var2}` 的格式, 这里只需要输入 `a=...`

当某个Args中的参数类型为 `obj1` 时, 需要输入 `a=...` 才能成功解析

`obj2` 表示:
- 匹配时需要加上 `test` 作为头部
- 匹配格式为 `part`, 即 `{head};{var1};{var2}` 的格式
- `a` 参数成功解析后会先乘以2再作为Test的参数传入

当某个 Args 中的参数类型为 `obj2` 时, 需要输入 `test;123;` 才能成功解析

:::info

ObjectPattern 内的优先级是 supplier > default > matched
即优先使用 supplier 提供的参数, 然后是默认值, 最后是匹配成功的参数

:::
