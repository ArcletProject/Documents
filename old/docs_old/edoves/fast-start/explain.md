---
id: explain
title: 程序解析
---

让我们逐步分析上篇代码的具体运行过程。

首先，我们创建了一个事件处理器，或者说响应器 Handlers

```python
async def test_message_reaction(message: Message):
    if message.content.startswith("Hello"):
        await message.set("Hello World!").send()
```

事件处理器是一个异步函数, 可以接受多个参数, 如`sender`, `app`等, 由该处理器处理的事件决定; 
此处处理器接受唯一参数`message`, 它是`Message`类型, 包含了事件类型、发送者与消息。

:::note Message

`Message` 并非为事件类型, 而是一类`Medium`类型, 或称为`媒介`

`Message` 包含`purveyor`属性、`content`属性与`type`属性。`purveyor`属性是一个`Monomer`类型, 
为该事件的发起者; `content`属性是一个`MessageChain`类型, 为发送的消息链; `type`是一个str, 指示
该`Message`的具体类型

:::

这里，我们使用了`message.content.startswith(xxx)`方法, 来判断消息链是否以`xxx`开头。

接下来，我们使用了`message.set(xxx)`方法, 来重置消息链内容, `xxx`应该为一系列消息元素

:::note 消息链

QQ 的消息不只是文本形式，所以 mirai 采用了消息链来表示富文本。为了更好的灵活性，Edoves 同样使用消息链来表示消息。

消息链可以看作是一系列消息元素构成的列表。

上面我们传入的`'Hello World'`会被自动转换为`Text`. `Text` 就是一个消息元素，它表示一段纯文本。

:::

之后, 我们使用了`message.send()`方法来发送消息。`Edoves`的内部实现逻辑会自动识别发送对象

下一步, 我们创建了一个Edoves实例, 并设置了账号、端口、网络客户端等等。

```python
app = Edoves(
    configs={
        "MAH-default": (
            MAHConfig, {"verify_token": "INITKEYWylsVdbr", "port": "9080", "client": AioHttpClient, "account": 3542928737}
        )
    },
)
```
`Edoves`需要的主要参数为configs传入的一系列scene相关参数。

`configs`传入的是一个字典对象, 该字典的键是`scene`的名称, 并作为该`scene`的标识符; 值是一个元组, 

该元组的第一个元素是一个特定的**配置**类, 该配置规定了`scene`的基本配置, 如protocol的选择、服务对接端的选择等。

该元组的第二个元素是一个字典, 用来传入`config`的必要参数。该字典的键是配置类的属性名, 值是配置类的属性值。

`AioHttpClient`是一个`NetworkClient`类型, 负责实际的网络操作。`AioHttpClient`为`NetworkClient`的`aiohttp`实现

接着, 我们激活了一个模块, 用来搭载处理器:
```python
message_module = app['MAH-default'].activate_module(MessageModule)
```
:::caution

`Module`要求其必须有静态变量`verify_code`，来验证其可用性

当验证失败时, 该模块激活失败, 并且日志警告：XXX does not supply the dock server you chosen

:::

随后，如果激活成功，我们将处理器搭载在该模块上：
```python
message_module.add_handler(MessageReceived, test_message_reaction)
```
`MessageReceived`是一个事件类型, 代表收到消息事件, 并作为该处理器处理的事件

最后，我们调用了`run`方法，来启动机器人。这一方法会进入事件循环，一直运行。

```python
app.run()
```