---
id: fire-like
title: Fire-like 方式
---

## 实例化

:::note

该方法来源于 [python-fire](https://github.com/google/python-fire)
中命令对象的创建方式。

:::

`Alconna` 的fire-like形式的构造方法, 如
```python
from arclet.alconna import AlconnaFire

class FireTest:
    def __init__(self, user):
        self.user = user
    def hello(self, name):
        print(f'"Hello {name}!" from {self.user}')
        
    class Sub:
        def set(self, name):
            print(f"set {name}")
            
    class Config:
        get_subcommand = True

if __name__ == "__main__":
    alc = AlconnaFire(FireTest)
    alc.parse("FireTest Alc hello World Sub conna")
```

它与如下是等效的:
```python
from arclet.alconna import Alconna, Option, Args, AnyParam, Subcommand

class FireTest:
    def __init__(self, user):
        self.user = user
        
class Sub:
    pass

def hello(fire_test: FireTest, name):
    print(f'"Hello {name}!" from {fire_test.user}')

def set(sub: Sub, name):
    print(f"set {name}")

alc = Alconna(
    command="FireTest",
    options=[
        Option("hello", Args["name":AnyParam]),
        Subcommand("Sub", [Option("set", Args["name":AnyParam])]),
    ],
    main_args=Args["user":AnyParam]
)

if __name__ == "__main__":
    r = alc.parse("FireTest Alc hello World Sub conna")
    fire = FireTest(r.get("user"))
    hello(fire, r.hello.name)
    sub = Sub()
    set(sub, r.Sub.set.name)

```

该方法可以传入如下对象:
- 一个类(Type), 其内部应该至少有一个方法/函数
- 一个函数或方法(Function|Method), 其内部应该至少有一个参数
- 一个模块(Module), 其内部应该至少有一个函数/方法
- 一个类实例(Instance), 其内部应该至少有一个方法/函数

:::tip

当不传入任何参数时, 会选择当前的模块(main)作为构造对象。

:::

## Config

`AlconnaFire` 可以通过传入`config` 参数配置对象, 也可以读取传入的对象内的以`Config`为名字的内部类

`Config` 类可以包含以下配置项:
- `command`: 命令名称, 用于替代对象名
- `headers`: 命令的头部信息
- `extra`: 对于未知变量类型的处理行为
- `get_subcommand`: 是否获取子命令
- `description`: 命令的帮助信息, 不填入则会尝试拿取对象的`__doc__`属性
- `raise_exception`: 当命令执行时, 是否抛出异常
- `namespace`: 命令的命名空间

:::tip

如果传入的对象为函数或者方法, `AlconnaFire`一样会尝试读取其内部的`Config`类作为命令的帮助信息

(~~虽然你的类型检查器可能不会高兴~~)

```python {6-9}
from arclet.alconna import AlconnaFire

def test(user:str):
    print(f"Hello {user}!")
    
    class FuncConfig:
        command = "test"
        description = "test description"
        extra = "raise"

alc = AlconnaFire(test)
```

:::

## 配合ArgPattern 与 ObjectPattern

大部分时候你是无法通过命令行来传入额外类型的变量, 这时候我们可以用`ArgPattern`和`ObjectPattern`来解决这个问题。

### ArgPattern

静态的变量, 或者说不需要动态创建的变量, 例如`AbstractEventLoop`等, 可以通过`ArgPattern`来指定。
```python
from arclet.alconna.types import ArgPattern, set_converter, PatternToken
from arclet.alconna import AlconnaFire
import asyncio
set_converter(
    ArgPattern(
        regex_pattern="loop",
        token=PatternToken.REGEX_TRANSFORM,
        origin_type=asyncio.AbstractEventLoop,
        converter=lambda x: asyncio.get_event_loop(),
        alias="loop"
    )
)

def test(loop: asyncio.AbstractEventLoop):
    print(loop)
alc = AlconnaFire(test)
```
此时尝试输入
```python
alc.parse("test loop")
```
则会打印出`asyncio.get_event_loop()`所获取到的事件循环.

### ObjectPattern

动态的变量, 或者说需要在解析时传入参数的变量, 例如一个自定义类, 可以通过`ObjectPattern`来构建。
```python
from arclet.alconna.types import ObjectPattern
from arclet.alconna import AlconnaFire

class MyClass:
    def __init__(self, name: str):
        self.name = name

ObjectPattern(MyClass, head="class", flag="http")

def test(obj: MyClass):
    print(obj.name)
alc = AlconnaFire(test)
```
此时尝试输入
```python
alc.parse("test class?name=abc")
```
则会打印出obj的name值`'abc'`

## Delegate

0.8.2 版本中新增了一个函数 `delegate`

其接受一个特定的类, 格式如下:

```python
from arclet.alconna import Args, Option, Subcommand, delegate

@delegate
class MyCommand:
    """主命令帮助"""
    prefix = "!" # or ["!", "！"]
    aa = Args["foo":int]
    opt1 = Option("opt")
    sub1 = Subcommand("sub", args=Args["bar":str])

MyCommand.parse("!MyCommand 123 opt")
```

也可以

```python
from arclet.alconna import Args, Option, Subcommand, delegate

class MyCommand:
    """主命令帮助"""
    prefix = "!" # or ["!", "！"]
    aa = Args["foo":int]
    opt1 = Option("opt")
    sub1 = Subcommand("sub", args=Args["bar":str])

delegate(MyCommand).parse("!MyCommand 123 opt")
```
