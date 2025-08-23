---
prev: Cithun
next: Entari
---

# Letoderea

[`Letoderea`](https://github.com/ArcletProject/Letoderea) 是 `Arclet Project` 下负责事件系统与依赖注入的模块，是 `Arclet` 的核心模块之一。

`Letoderea` 旨在提供一种简单的方式，使得开发者可以在不了解事件系统的情况下，也能够轻松地进行事件的监听与处理。

## 安装

:::code-group
```bash:no-line-numbers [pdm]
pdm add "arclet-letoderea"
```

```bash:no-line-numbers [uv]
uv add "arclet-letoderea"
```

```bash:no-line-numbers [pip]
pip install "arclet-letoderea"
```

:::

## 基本用法

```python
import arclet.letoderea as leto

@leto.make_event
class TestEvent:
    value: int

@leto.on(TestEvent)
async def _(value: int):
    print(f"Received {value}")
```

上述代码实现了一个简单的功能：当 `TestEvent` 事件被触发时，打印出事件的 `value` 值。
如你所见，`on` 方法监听了一个事件，传入的参数表示监听事件的类型，而通过装饰器形式，我们注册了
一个该事件的订阅者（通常称为回调函数）。

所有订阅者函数的参数都被视为依赖注入的声明。在这个例子中，我们声明该订阅者的依赖参数为 `value: int`，
这意味着当事件被触发时，其属性 `value` 会自动对应到订阅者的 `value` 参数。

:::tip

`make_event` 在这里至关重要。它会将装饰的事件类包装为 `dataclass`, 读取表示事件的类中声明的属性，并生成对应的规则来进行依赖注入。

:::

## 监听事件

在上面的例子中，我们已经了解到事件系统的基本用法：通过 `on` 方法注册一个事件的订阅者。
`on` 方法的签名如下：

:::details 函数签名
```python
def on(
    event: type,
    func: Callable[..., Any] | None = None,
    priority: int = 16,
    providers: TProviders | None = None,
    once: bool = False,
    skip_req_missing: bool | None = None
):
    ...
```

- `event`：事件的类型，表示监听的事件。
- `func`：订阅者函数，即回调函数。当传入 `None` 时，表示将用装饰器形式来注册订阅者。
- `priority`：订阅者的优先级，数值越小，优先级越高。
- `providers`：自定义的额外依赖注入提供者。通常而言，我们不需要传入这个参数。
- `once`：是否为临时订阅者。临时订阅者在事件被触发后会将自动注销。
- `skip_req_missing`：是否在依赖缺失时跳过该订阅者。当传入 `None` 时，表示使用全局配置。
:::


无论是通过装饰器还是函数形式，`on` 都会返回一个 `Subscriber` 对象。我们着重关注这个对象的 `dispose` 方法：调用该方法可以取消订阅。

```python
subscriber = leto.on(TestEvent, lambda value: print(f"Received {value}"))
subscriber.dispose()  # 取消订阅
```

[//]: # (### 发布者&#40;Publisher&#41;)

[//]: # ()
[//]: # (在 `Letoderea` 中，事件会有一个对应的发布者。通常情况下，我们不需要手动创建发布者，而是通过 `define` 方法来为某一事件定义发布者。)

[//]: # ()
[//]: # (```python)

[//]: # (import arclet.letoderea as leto)

[//]: # ()
[//]: # (class TestEvent: ...)

[//]: # ()
[//]: # (leto.define&#40;TestEvent, name="test"&#41;)

[//]: # (```)

[//]: # ()
[//]: # (:::tip)

[//]: # ()
[//]: # (`make_event` 会自动调用 `define` 方法，因此我们通常只需要用 `make_event` 来装饰目标事件类。)

[//]: # ()
[//]: # (:::)

[//]: # ()
[//]: # (每个发布者都有一个唯一的名称 &#40;name&#41;，用于标识该发布者。未指定名称时，发布者会使用事件的类名作为名称。)

[//]: # ()
[//]: # (### `use` 方法)

[//]: # ()
[//]: # (`use` 方法是 `on` 方法的一个变种，它使用 `Publisher.id` 来指定监听的事件。)

[//]: # ()
[//]: # (```python)

[//]: # (pub = leto.define&#40;TestEvent, name="test"&#41;)

[//]: # ()
[//]: # (sub1 = leto.use&#40;pub, lambda value: print&#40;f"Received {value}"&#41;&#41;)

[//]: # (sub2 = leto.use&#40;"test", lambda value: print&#40;f"Received {value}"&#41;&#41;)

[//]: # (```)

### `on_global` 方法

`on_global` 方法是 `on` 方法的一个变种。由其注册的订阅者将会监听所有事件，而不仅仅是特定的事件类型。


```python
import arclet.letoderea as leto

@leto.on_global
def global_subscriber(event):
    print(f"Global Subscriber: {event}")
```

## 触发事件

事件的触发通过 `publish` 或 `post` 方法来实现。

```python
await leto.publish(TestEvent(42))
result = await leto.post(TestEvent(42))

```

- publish: 异步地并行触发该事件的所有订阅者。
- post: 异步地触发该事件的所有订阅者，当有其中一个订阅者返回了 `None` 以外的值时，将这个值作为结果返回。

使用 `post` 时，若事件满足 `Resultable` 协议：

```python
class Resultable(Protocol[T]):
    __result_type__: type[T]
```

则 `post` 方法会返回的 `Result` 对象将拥有对应的类型提示。同时，订阅者的返回值也将用 `__result_type__` 来进行校验。


:::tip

`post` 和 `publish` 方法是同步的，它们的返回值是 `asyncio.Task` 对象。这意味着，你可以在某些同步的代码中进行事件的触发。

:::

[//]: # (### 轮询事件)

[//]: # ()
[//]: # (`Letoderea` 还提供了轮询事件的功能。该功能通过 `setup_fetch&#40;&#41;` 启用。)

[//]: # ()
[//]: # (启用后，`Letoderea` 会自动轮询所有发布者，并将获取到的事件分发给对应的订阅者。)


## 依赖注入

`Letoderea` 的核心功能之一是依赖注入。通过在订阅者函数的参数中声明依赖，`Letoderea` 可以自动解析并提供这些依赖。

```python {9}
import arclet.letoderea as leto

@leto.make_event
class TestEvent:
    foo: str
    bar: int

@leto.on(TestEvent)
async def subscriber(foo: str, bar: int):
    print(f"Received foo: {foo}, bar: {bar}")
```

```python
await leto.publish(TestEvent(foo="Hello", bar=42))
# Output: Received foo: Hello, bar: 42
```

`Letoderea` 默认会提供两个依赖：
- `event`：事件本身。注入方式要求参数名必须为 `event`，类型不限制。
- `context: Contexts`：一个上下文对象，包含了所有的依赖和事件信息。注入方式要求参数类型必须为 `Contexts`，名称不限。

:::tip

`Contexts` 是一个字典-like 的对象，支持通过键访问依赖。

对于每一个订阅者函数，其使用的 `Contexts` 实例都是独立的。

::: 

### 依赖收集

当目标事件确认传递给订阅者后，一个 `Contexts` 类的实例将会被创建。这个实例会收集所有的依赖，并在订阅者函数执行时传递给它。

而对于事件类而言，其是通过特定的 `gather` 方法来提供依赖收集的功能。

```python
class MyEvent:
    async def gather(self, ctx: Contexts) -> None:
        ctx["foo"] = "Hello"
        ctx["bar"] = 42
```

除了定义 `gather` 方法外，我们也可以在调用 `define` 时传入 `supplier` 参数，或使用 `@gather` 装饰器来注册一个依赖收集方法。这对于目标事件属于**第三方库或无法修改**的情况非常有用。


:::details 为 `int` 定义依赖收集

```python
import arclet.letoderea as leto

@leto.gather
async def gather_integer(target: int, ctx: Contexts):
    ctx["value"] = target

@leto.on(int)
async def integer_subscriber(value: int):
    print(f"Received integer: {value}")
```

:::

### 依赖提供

收集依赖完成后，我们还需要确定 `Contexts` 中的依赖与订阅者函数的参数之间的映射关系。`Letoderea` 提供了 `Provider` 类来实现这一功能。

:::details 定义一个 `Provider`
```python {8-18}
import arclet.letoderea as leto
from arclet.letoderea import Provider, Param

@leto.make_event
class FooEvent:
    foo: str

    class FooProvider(Provider[str]):
        def validate(self, param: Param):
            return param.name == "foo"
        async def __call__(self, ctx: Contexts) -> str:
            return ctx["foo"]

    class Foo2Provider(Provider[str]):
        def validate(self, param: Param):
            return param.name == "foo2"
        async def __call__(self, ctx: Contexts) -> str:
            return ctx["foo"] * 2

@leto.on(FooEvent)
async def foo_subscriber(foo: str, foo2: str):
    assert foo == "Hello"
    assert foo2 == "HelloHello"
```
:::

如上所示，我们定义了一个 `FooProvider`，它基本上只需要实现 `validate` 和 `__call__` 方法。

- `validate` 方法用于判断当前的参数是否符合绑定条件。
  - `param` 参数是一个 `Param` 对象，包含了订阅者函数的参数的信息：名称、类型、默认值和当前参数是否已有绑定。
- `__call__` 方法用于返回依赖的值。你可以在这个方法中对原始值进行处理或转换。

除了继承 `Provider` 类外，我们还可以使用 `provide` 函数来生成一个 `Provider` 实例。

```python
from arclet.letoderea import provide

foo_provider = provide(str, target="foo", call=lambda ctx: ctx["foo"])
foo2_provider = provide(str, target="foo2", call=lambda ctx: ctx["foo"] * 2)
```

有些情况下，我们会需要 `Param` 的信息来生成依赖的值，而正常的 `Provider` 是无法存储这些信息的。

此时，我们可以使用 `ProviderFactory`, 在 `validate` 方法中返回特定的 `Provider` 实例。

:::details 使用 `ProviderFactory`
```python {8-13}
import arclet.letoderea as leto
from arclet.letoderea import ProviderFactory, Param

@leto.make_event
class MyEvent:
    value: int

class MyFactory(ProviderFactory):
    def validate(self, param: Param):
        if param.name.startswith("int_"):
            return leto.provide(int, target=param.name, call=lambda ctx: ctx["value"])
        if param.name.startswith("str_"):
            return leto.provide(str, target=param.name, call=lambda ctx: str(ctx["value"]))

@leto.on(MyEvent, providers=[MyFactory])
async def my_subscriber(int_value: int, str_value: str):
    assert int_value == 42
    assert str_value == "42"
```
::: 

无论是 `Provider` 还是 `ProviderFactory`，它们都应该
- 在事件类内部定义
- 声明事件类的类属性 `providers`, 例如 `providers = [FooProvider, Foo2Provider]`
- 在 `on` 方法中通过 `providers` 参数传入。

### 子依赖

在依赖注入系统中，我们可以定义一个子依赖，来执行自定义的操作，提高代码复用性以及处理性能。

子依赖使用 `Depends` 标记进行定义。其传入的参数将同样被解析为一个订阅者函数，接受系统的依赖注入。

:::code-group
```python [用 Depends]
import arclet.letoderea as leto

def handle_foo_bar(foo: str, bar: int) -> str:
    return f"Foo: {foo}, Bar: {bar}"

@leto.on(TestEvent)
async def test_subscriber(msg: str = leto.Depends(handle_foo_bar)):
    print(msg)  # Foo: Hello, Bar: 42
```

```python [用 @depends]
import arclet.letoderea as leto

@leto.depends()
def handle_foo_bar(foo: str, bar: int) -> str:
    return f"Foo: {foo}, Bar: {bar}"

@leto.on(TestEvent)
async def test_subscriber(msg: str = handle_foo_bar):
    print(msg)  # Foo: Hello, Bar: 42
```

```python [配合 Annotated]
from typing import Annotated
import arclet.letoderea as leto

@leto.depends()
def handle_foo_bar(foo: str, bar: int) -> str:
    return f"Foo: {foo}, Bar: {bar}"

@leto.on(TestEvent)
async def test_subscriber(msg: Annotated[str, handle_foo_bar]):
    print(msg)  # Foo: Hello, Bar: 42
```
:::

在上面的代码中，我们使用 `Depends` 标记定义了一个子依赖 `handle_foo_bar`，它接受 `foo` 和 `bar`，并返回一个字符串。然后，我们在订阅者函数中使用该子依赖来获取处理后的结果。

通过将 `Depends` 包裹的子依赖作为参数的默认值，我们就可以在执行事件处理函数之前执行子依赖，并将其返回值作为参数传入事件处理函数。子依赖和普通的事件处理函数并没有区别，同样可以使用依赖注入，并且可以返回任何类型的值。

子依赖执行后，其结果会被保存在 `Contexts` 中。 当我们在声明子依赖时，会有一个 `cache` 参数，用于指定多次使用同一个子依赖时是否使用缓存。

:::details 子依赖缓存
```python
from random import randint, seed

seed(42)  # 固定随机数种子，确保每次运行结果相同

@leto.depends(cache=True)
def random_number() -> int:
    return randint(1, 10)

@leto.on(TestEvent)
async def s1(num: int = random_number):
    print(f"Random number: {num}")  # Random number: 2

@leto.on(TestEvent)
async def s2(num: int = random_number):
    print(f"Random number: {num}")  # Random number: 2
```
:::

在同一个事件的分发过程中，这个随机函数的返回值将会保持一致。
缓存的生命周期与当前接收到的事件相同。接收到事件后，子依赖在首次执行时缓存，在该事件处理完成后，缓存就会被清除。

## 传播

当订阅者被创建后，它可以通过 `propagate` 方法来注册一个前置或后置的同级订阅传播。

:::code-group
```python [前置传播]
@leto.on(TestEvent)
async def subscriber(baz: str):
    print(f"前置传播结果: {baz}")  # 前置传播结果: Foo: Hello, Bar: 42

@subscriber.propagate(prepend=True)
async def pre_subscriber(foo: str, bar: int):
    return {"baz": f"Foo: {foo}, Bar: {bar}"}
```

```python [后置传播]
@leto.on(TestEvent)
async def subscriber(foo: str, bar: int):
    return f"Foo: {foo}, Bar: {bar}"

@subscriber.propagate()
async def post_subscriber(result: str):
    print(f"后置传播结果: {result}")  # 后置传播结果: Foo: Hello, Bar: 42
```
:::

通过合适的传播定义，我们可以类似于定义**中间件**，在事件处理过程中进行更复杂的操作。

:::tip

无论是后置还是前置传播，其基础的依赖环境都是相同的，也即传播者们与主订阅者共享同一个 `Contexts` 实例、同一份 `Provider` 列表。

:::

`propagate` 方法的签名如下：

:::details 函数签名
```python
def propagate(
    self,
    func: TTarget[Any] | Propagator | None = None,
    *,
    prepend: bool = False,
    priority: int = 16,
    providers: TProviders | None = None,
    once: bool = False
):  
    ...
```

- `func`：传播的目标函数或 `Propagator` 实例。当传入 `None` 时，表示将用装饰器形式来注册传播者。
- `prepend`：是否为前置传播。默认为 `False`，表示后置传播。
- `priority`：传播者的优先级，可由此控制传播者的执行顺序。数值越小，优先级越高。
- `providers`：自定义的额外依赖注入提供者。通常而言，我们不需要传入这个参数。
- `once`：是否为临时传播者。临时传播者在事件被触发后会将自动注销。

::: 

**后置传播**是指在主订阅者函数执行完毕后，再"往下"执行传播者函数。后置传播者函数可以注入主订阅者函数的返回值，并对其进行处理。

**前置传播**是指在主订阅者函数执行之前，先执行传播者函数。前置传播者函数可以对 `Contexts` 进行修改，或返回一个字典来拓展依赖。

### 传播集成

除了传入函数注册传播者外，我们还可以使用 `Propagator` 类来集成传播者。

```python {9-12}
from arclet.letoderea import Propagator

async def pre_subscriber(foo: str, bar: int):
    return {"baz": f"Foo: {foo}, Bar: {bar}"}

async def post_subscriber(result: str):
    print(f"后置传播结果: {result}")

class MyPropagator(Propagator):
    def compose(self):
        yield pre_subscriber, True
        yield post_subscriber

@leto.on(TestEvent)
async def subscriber(baz: str):
    print(f"前置传播结果: {baz}")
    return baz

subscriber.propagate(MyPropagator())
```

`Propagator` 主要工作就是实现 `compose` 方法，该方法是一个生成器，用于返回传播者函数和是否为前置传播的标志、优先级等。

通过 `Propagator`，我们可以将多个传播者函数组合在一起，以提供便利服务。

:::details `Cooldown` 示例
```python
class Cooldown(Propagator):
    def __init__(self, interval: float):
        self.interval = interval
        self.last_time = None
        self.success = True

    async def before(self):
        if self.last_time is not None:
            self.success = (datetime.now() - self.last_time).total_seconds() > self.interval
            if not self.success:
                return STOP
        return {"last_time": self.last_time}

    async def after(self):
        self.last_time = datetime.now()

    def compose(self):
        yield self.before, True
        yield self.after, False
```
::: 

## 特殊返回值

针对订阅者函数，`Letoderea` 还提供了特殊的返回值：`ExitState`，其分为 `STOP` 和 `BLOCK` 两种。

**`STOP`** 在同级传播中尤其有用，它会阻止后续的传播者函数执行。通常用在前置传播中，表示不满足执行条件。

```python
from datetime import datetime
from arclet.letoderea import STOP

@leto.on(TestEvent)
async def subscriber(foo: str, bar: int):
    print(f"Received foo: {foo}, bar: {bar}")

@subscriber.propagate(prepend=True)
def check_time():
    if datetime.now().hour < 12:
        return STOP  # 阻止后续传播者执行
```

上述代码中，如果当前时间在中午12点之前，`check_time` 函数将返回 `STOP`，从而阻止后续的传播者函数执行，使得该订阅者只能在中午12点之后被触发。

而 **`BLOCK`** 则会阻止当前事件的传播，表示该事件不应继续被处理。

```python
from arclet.letoderea import BLOCK

@leto.on(TestEvent, priority=1)
async def subscriber(foo: str, bar: int):
    print(f"Received foo: {foo}, bar: {bar}")
    return BLOCK  # 阻止当前事件的传播

@leto.on(TestEvent, priority=2)
async def blocked_subscriber(foo: str, bar: int):  # 此订阅者将不会被触发
    print(f"Received foo: {foo}, bar: {bar}")
```

:::tip
ExitState 类既是 `Enum` 也是 `Exception`，因此可以直接 `raise STOP`。
:::

## 快捷方式

`Letoderea` 提供了一些快捷方式来简化常见的事件处理模式。

### `bind`

`bind` 是 `providers` 参数的一个快捷方式，以装饰器形式使用。

:::code-group
```python [bind]
import arclet.letoderea as leto

@leto.on(TestEvent)
@leto.bind(leto.provide(str, target="foo", call=lambda ctx: ctx["foo"]))
async def subscriber(foo: str):
    ...
```

```python [对比]
import arclet.letoderea as leto

@leto.on(TestEvent, providers=[leto.provide(str, target="foo", call=lambda ctx: ctx["foo"])])
async def subscriber(foo: str):
    ...
```
:::

### `propagate`

`propagate` 是 `Subscriber.propagate` 的一个快捷方式，用于注册传播者。

:::code-group
```python [propagate]
import arclet.letoderea as leto

async def pre_subscriber(foo: str, bar: int):
    return {"baz": f"Foo: {foo}, Bar: {bar}"}

@leto.on(TestEvent)
@leto.propagate(pre_subscriber, prepend=True)
async def subscriber(baz: str):
    ...
```

```python [对比]
import arclet.letoderea as leto

@leto.on(TestEvent)
async def subscriber(baz: str):
    ...

@subscriber.propagate(prepend=True)
async def pre_subscriber(foo: str, bar: int):
    return {"baz": f"Foo: {foo}, Bar: {bar}"}
```
:::

对于前置传播而言, `@propagate` 会更符合直觉，因为它可以直接在订阅者函数上使用，而不需要额外的 `Subscriber` 实例。

### 过滤器

基于传播机制，`Letoderea` 还提供了过滤器的功能。过滤器可以在事件处理之前对事件进行筛选。

- `enter_if`：如果事件满足某个条件，则允许当前订阅者执行。
- `bypass_if`：如果事件满足某个条件，则拒绝当前订阅者执行。
- `allow_event`: 如果事件是某个类型，则允许当前订阅者执行。
- `refuse_event`: 如果事件是某个类型，则拒绝当前订阅者执行。

过滤器可以叠加使用：

```python
from arclet.letoderea import enter_if

@leto.on(TestEvent)
@(enter_if(lambda event: event.foo == "Hello") & (lambda event: event.bar > 0))
async def subscriber(foo: str, bar: int):
    print(f"Received foo: {foo}, bar: {bar}")
```

### `deref`

`deref` 是针对事件类的魔术方法，用于生成对事件的属性值的操作。

:::code-group
```python [依赖注入]
from typing import Annotated
from arclet.letoderea import deref

@leto.on(TestEvent)
async def subscriber(baar: Annotated[int, deref(TestEvent).bar]):
    ...
```

```python [过滤器]
from arclet.letoderea import deref, enter_if

@leto.on(TestEvent)
@(enter_if(deref(TestEvent).foo == "Hello") & (deref(TestEvent).bar > 0))
async def subscriber(foo: str, bar: int):
    print(f"Received foo: {foo}, bar: {bar}")
```
:::
