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


