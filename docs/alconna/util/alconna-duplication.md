---
id: duplication
title: 副本
---

## Alconna Duplication

在 v0.7.7中, `Alconna` 加入了一个特殊的类 `Duplication`, 作为对 `Arpamar` 的一个简单的封装.

你需要通过声明`Stub`类来选择记录哪些解析数据, 并通过这些`Stub`来获取成功解析的数据.

### 构造

以下是一个简单的命令:

```python
from arclet.alconna import Alconna, Args, Option

alc = Alconna(
    "my_command",
    Args["foo":str, "bar":int],
    options=[
        Option("--baz", Args["baz":str])
    ]
)
```

我们可以看到该命令拥有一个`Args`和一个`Option`.

对应的`Duplication`则应该是:

```python
from arclet.alconna import AlconnaDuplication, ArgsStub, OptionStub

class MyCommand(AlconnaDuplication):
    args: ArgsStub
    baz: OptionStub
```

:::caution

对于`Option`与`Subcommand`的对应Stub, 其在`Duplication`中的名称必须为自身的name.

:::

然后在`Alconna`解析时, 将其传入`parse`方法中:

```python
dup = alc.parse("my_command abc 123 --baz def", duplication=MyCommand)
```

此时返回的dup对象则会是`MyCommand`的一个实例.

### 使用

就如一个正常的类一样, 你可以通过访问自己写的属性访问这些数据.

另外, `Alconna Duplication`类提供了

## Stub

`Stub`是一个抽象类, 它的子类可以被`Alconna`解析.

一般而言, 你可以通过`Stub`来获取解析的数据.

其有三个基本属性:
- `Stub.available`: 查看该组件是否解析成功.
- `Stub.value`: 获取解析的数据.
- `Stub.origin`: 该组件存有的原始组件类.

### ArgsStub

`ArgsStub` 争对`Args`类, 通过它来操作`Args`的解析数据.

:::note

`ArgsStub` 可以直接通过arg的key去访问解析值, 但必须在动态获取下才能有自动补全.

:::

`ArgsStub.first_arg` 可以获取第一个解析的参数.

`ArgsStub.get` 会根据传入的值切换是以`key`还是`type`来获取解析的数据.

另外也可以通过`ArgsStub[key]`与`ArgsStub[index]`来获取解析的数据.

### OptionStub

`OptionStub` 争对`Option`类, 通过它来操作`Option`的解析数据.

### SubcommandStub

`SubcommandStub` 争对`Subcommand`类, 通过它来操作`Subcommand`的解析数据.

