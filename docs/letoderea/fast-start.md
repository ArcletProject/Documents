---
id: fast-start
title: 快速入门
---

## 安装

首先, 我们需要安装 `arclet-letoderea`:

```bash
pip install --upgrade arclet-letoderea
```

## 准备工作

在main程序中导入主实现类 `EventSystem` 和前置标准库 `asyncio`:

```python title="/src/test_letoderea.py"
import asyncio
from arclet.letoderea import EventSystem
```

获取事件循环, 并实例化 `EventSystem`:

```python
loop = asyncio.get_event_loop()
event_system = EventSystem(loop=loop)
```

由于分发事件的方式是使用 `loop.create_task`, 所以 `EventSystem` 需要依附于一个正在运行的 `loop` 才能使用,
通常你可以通过 `loop.run_until_complete` 或者 `loop.run_forever` 方法运行事件循环.

## 自定义一个事件

导入事件基类:

```python
from arclet.letoderea.entities.event import TemplateEvent
```

声明一个事件类，需满足以下条件：
 - 继承 `TemplateEvent`，以保证 `search_event` 方法可以使用。
 - 实现 `get_params` 方法，其调用`param_export`方法，以声明该事件可接触的参数。

```python
class MyEvent(TemplateEvent):
    def get_params(self):
        return self.param_export(
            message="Hello World!",
        )
```

## 注册订阅器

:::tip

`订阅器` 来源于 `C#` 中, 关于 `delegate` 与 `event` 的抽象结构中的`subscriber`，

:::

使用装饰器方法 `EventSystem.register` 注册对一个事件的订阅器:

```python
@event_system.register(MyEvent) # 传入字符串 "MyEvent" 效果一样
async def my_subscriber(message: str):
    print(message)
```

函数中的形参声明类型注解为 `str` 就能获取收到的事件中对应类型的参数.

这里的 `my_subscriber`, 我们称其为 "订阅器(Subscriber)".

## 发布事件

创建事件就是实例化事件类. 因为没有声明`__init__`方法, 此处 `MyEvent` 只需要简单的实例化就好，

:::note

未来版本中或许会将`Publisher`作为事件创建的必要途径.

:::

```python
event = MyEvent()
```

然后通过 `EventSystem.event_publish` 方法即可将事件发布给所有订阅器:

```python
event_system.event_publish(event)
```

通过 `asyncio` 的相关接口（比如 run 一个 do nothing 的异步函数）运行程序，
如果不出意外的话, `my_subscriber` 将会被执行, 并将`MyEvent`的参数 `message` 输出到控制台.

> _Hello World!_

恭喜，你已经运行起来了一个基于 `Letoderea` 的程序实例。

接下来将逐步介绍 `Letoderea` 的结构。

## 使用样例
```python
import asyncio
from arclet.letoderea import EventSystem
from arclet.letoderea.entities.event import TemplateEvent

class MyEvent(TemplateEvent):
    def get_params(self):
        return self.param_export(
            message="Hello World!",
        )
 
loop = asyncio.get_event_loop()
event_system = EventSystem(loop=loop)

@event_system.register(MyEvent)
async def my_subscriber(message: str):
    print(message)

async def main():
    event_system.event_publish(MyEvent())
    await asyncio.sleep(0.1)
    
loop.run_until_complete(main())
```