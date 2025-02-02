---
prev: NEPattern 1.0
---

# Letoderea

[`Letoderea`](https://github.com/ArcletProject/Letoderea) 是 `Arclet Project` 下负责事件系统与依赖注入的模块，是 `Arclet` 的核心模块之一。

`Letoderea` 旨在提供一种简单的方式，使得开发者可以在不了解事件系统的情况下，也能够轻松地进行事件的监听与处理。

## 基本用法

```python
import arclet.letoderea as leto
from dataclasses import dataclass

@leto.make_event
@dataclass
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

`make_event` 在这里至关重要。它会读取表示事件的类中声明的属性，并生成对应的规则来进行依赖注入。

:::

## 监听事件

在上面的例子中，我们已经了解到事件系统的基本用法：通过 `on` 方法注册一个事件的订阅者。
`on` 方法的签名如下：

```python
def on(
    self,
    events: type | tuple[type, ...] | None = None,
    func: Callable[..., Any] | None = None,
    priority: int = 16,
    providers: Sequence[Provider | type[Provider] | ProviderFactory | type[ProviderFactory]] | None = None,
    temporary: bool = False,
    skip_req_missing: bool | None = None,
):
    ...
```

- `events`：事件的类型，可以是单个类型，也可以是一个元组，表示同时监听多个事件。当传入 `None` 时，表示监听所有事件。
- `func`：订阅者函数，即回调函数。当传入 `None` 时，表示将用装饰器形式来注册订阅者。
- `priority`：订阅者的优先级，数值越小，优先级越高。
- `providers`：自定义的额外依赖注入提供者。通常而言，我们不需要传入这个参数。
- `temporary`：是否为临时订阅者。临时订阅者在事件被触发后会将自动注销。
- `skip_req_missing`：是否在依赖缺失时跳过该订阅者。当传入 `None` 时，表示使用全局配置。

无论是通过装饰器还是函数形式，`on` 都会返回一个 `Subscriber` 对象。我们着重关注这个对象的 `dispose` 方法：调用该方法可以取消订阅。

```python
subscriber = leto.on(TestEvent, lambda value: print(f"Received {value}"))
subscriber.dispose()  # 取消订阅
```

### 发布者(Publisher)

在 `Letoderea` 中，事件会有一个对应的发布者。通常情况下，我们不需要手动创建发布者，而是通过 `es.define` 方法来为某一事件定义发布者。

```python
from arclet.letoderea import es

class TestEvent: ...

es.define(TestEvent, name="test")
```

:::tip

`make_event` 会自动调用 `es.define` 方法，因此我们通常只需要用 `make_event` 来装饰目标事件类。

:::

每个发布者都有一个唯一的名称 (name)，用于标识该发布者。未指定名称时，发布者会使用事件的类名作为名称。


### `use` 方法

`use` 方法是 `on` 方法的一个变种，它使用 `Publisher.id` 来指定监听的事件。

```python
pub = es.define(TestEvent, name="test")

sub1 = leto.use(pub, lambda value: print(f"Received {value}"))
sub2 = leto.use("test", lambda value: print(f"Received {value}"))
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

