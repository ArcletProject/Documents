---
id: click-like
title: Click-like 方式
---

:::tip

与前面几类方法不同, click-like集成了命令行输入功能，并且对回调函数有特定的方法去自定义。

:::

## 实例化

click-like相较复杂一点，但支持独有的回调函数：

```python
from arclet.alconna import AlconnaDecorate
from arclet.alconna import Args

cli = AlconnaDecorate()

@cli.build_command()
@cli.option("--foo", Args["bar":str], alias="-F", help="测试选项")
def hello(bar: str):
    print("hello", bar)

if __name__ == "__main__":
    hello.from_commandline()    

```

它与如下是等效的:
```python
import sys
from arclet.alconna import Alconna, Args, Option
alc = Alconna(
    command="hello",
    options=[
        Option("--foo", Args["bar":str], alias="-F", help_text="测试选项")
    ]
)
def hello(bar: str):
    """测试Click-like功能"""
    print("hello", bar)

if __name__ == "__main__":
    message = ''.join(sys.argv[1:])
    result = alc.parse(message)
    if result.matched:
        hello(**result.all_matched_args)

```

## 编写规则

与`click`有所不同, 在编写命令前, 首先需要实例化一个`AlconnaDecorate`对象, 来作为命令的编写器。

`AlconnaDecorate`可以传入两个参数:
- `namespace`: 命令的命名空间, 如果不传入, 则默认为`Alconna`
- `loop`: `asyncio`中的事件循环, 用以在可能的异步操作中。

`AlconnaDecorate` 对象有如下方法：
### build_command

该方法用来标记开始编写命令，并使其装饰的函数变为命令执行体的回调函数.

该方法可以传入一个`name`参数, 会作为该命令的指令名称. 如果不传入, 则默认为函数名称.

### option

与构建[`Option`](../basic/alconna-opt-and-sub.md)的使用方法一样, 但是可以用`help=xxx`直接传入帮助信息.

### argument

其传入的`Args`对象会作为该命令的主参数。

### set_default_parser

该方法应当传入一个特定类型的`function`, 其用来完成参数分配任务与函数执行

其第一个参数`exec_target`, 为你构建命令时装饰的回调函数;

其第二个参数`all_matched_args`, 为该命令解析到的所有参数, 但注意有些参数是可选的, 不能保证一定能获取到;

其第三个参数`local_args`, 为对解析参数的补充, 可以用来设置默认值;

其第四个参数`loop`, 为`asyncio`中的`EventLoop`, 用来支持可能的异步操作.

:::tip

该方法既可以作为装饰器使用, 如
```python
cli = AlconnaDecorate()
@cli.set_default_parser
def my_parser(func, args, largs, loop):
    ...
```

也可以链式调用, 如

```python
def my_parser(func, args, largs, loop):
    ...
cli = AlconnaDecorate().set_default_parser(my_parser)
```

:::

`build_command`执行完后, `AlconnaDecorate`会把其装饰的函数包装为一个`ALCCommand`, 正如`click`所做的.

## ALCCommand

`ALCCommand`是承载着`Alconna`与回调函数的命令执行体, 其可以通过两种方法来解析命令：

1.`ALCCommand(xxx)`: 与`Alconna.analyse_message()`作用一致

2.`ALCCommand.from_commandline()`: 会尝试从`sys.argv`中获取命令, 并且该方法会自动填入指令名称,
即输入
```powershell
PS C:\Users\Administrator> python my_alconna.py -m --foo ALCONNA
```
而不是
```powershell
PS C:\Users\Administrator> python my_alconna.py -m hello --foo ALCONNA
```

## 帮助信息

如[help-doc](../detail/help-doc.md)中所说, Alconna内置了`--help` 选项, 所以在此我们只考虑如何写入

对于`option`, 信息应在`@option(..., help=xxx)`中写入

对于主命令, 信息应在回调函数中的`docstring`中写入
