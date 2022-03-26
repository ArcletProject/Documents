---
id: extra
title: 外部应用
---

## Alconna Dispatcher

:::tip

此处为适配`Graia Project`的`Alconna Dispatcher`, 用于在`Graia Project`中调用`Alconna`的API.

:::

`Alconna Dispatcher`的作用是作为一类消息解析器, 依靠`Graia Broadcast`的核心功能, 实现在机器人框架中的消息解析.
依靠`DispatcherInterface`, `Alconna`在此运用了良好的拓展性.

### 导入

`Alconna Dispatcher`现位于`arclet.alconna.graia`下, 你可以通过:

```bash
pip install arclet-alconna-graia
```
或
```bash
pip install arclet-alconna[graia]
```

来获取`Alconna Dispatcher`的依赖.

:::note

请最好一并将alconna更新到最新版本

:::

### 编写

以下为示范例:

```python
...
from arclet.alconna.graia.dispatcher import AlconnaDispatcher, Alconna, AlconnaProperty
from arclet.alconna import Args, Option
...
game = Alconna(
    "开始游戏",
    Args["game":str],
    options=[
        Option("--player", Args["count":int:1])
    ],
)


@app.broadcast.receiver(GroupMessage, dispatchers=[AlconnaDispatcher(alconna=game)])
async def game_start(app: Ariadne, result: AlconnaProperty):
    ...

```

可以看到, `Alconna`本体的编写并不需要任何变动, 只需要在`AlconnaDispatcher`中指定`Alconna`即可.

### 使用

`AlconnaDispatcher` 目前有如下参数:
- `alconna`: `Alconna`本体
- `help_flag`: 当收到`--help`时的对应行为, 默认为`stay`, 可选值为`reply`或`post`
- `skip_for_unmatch`: 当收到的消息不匹配`Alconna`时是否跳过, 默认为`True`
- `allow_quote`: 当收到的消息是用户回复时, 是否继续解析, 默认为`False`
- `help_handler`: 当收到`--help`时对帮助信息的处理函数.

若`help_flag`选择`reply`, 则`AlconnaDispatcher`会自动将帮助信息发出.
若`help_flag`选择`post`, 则`AlconnaDispatcher`会利用`Broadcast`广播一个事件, 并将帮助信息作为参数发出.

:::caution

正如`--help`会让`Alconna`解析失败, `reply`和`post`的行为也会使`AlconnaDispatcher`停止执行.

:::

### 标注与分配

利用`Broadcast`的优良特性, `AlconnaDispatcher`可以将解析值很好的分配给响应参数

对于一个含有`AlconnaDispatcher`的listener, 我们支持写入以下的参数类型:

只指定类型:
* `Arpamar`, 参数名可以任意
* `AlconnaProperty, 及用户自己定义的子类`, 参数名可以任意
* `Alconna`, 参数名可以任意
* `AlconnaDuplication, 及用户自己定义的子类`, 参数名可以任意
* `ArgsStub`, 参数名可以任意, 但不一定会被解析(如果`Alconna`本体没有主参数)

需要指定名称:
* `xxx:str/int/...`, xxx必须对应`Alconna`中的某个参数名
* `xxx:OptionStub/SubcommandStub`, xxx必须与`Alconna`中的某个选项名或子命令名对应

特殊:
* `help_text:str`, 当收到`--help`时的帮助信息

:::info

外部链接:

graia-ariadne: [官方文档](https://graia.readthedocs.io/advance/alconna/quickstart/)

graiax: [社区文档](https://graiax.cn/make_ero_bot/tutorials/6_4_alconna.html#_6-4-alconna)

:::