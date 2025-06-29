---
prev: Letoderea
next: Tarina
---

# Entari

[`Entari`](https://github.com/ArcletProject/Entari) 是 `Arclet Project` 下一个基于 [`Satori`](https://satori.js.org/) 协议的即时通信框架

其特点有：
- 基于 Satori 协议，一份代码即可对接多种平台
- 异步并发，基于 Python 的异步特性，即使有大量的事件传入，也能吞吐自如
- 易上手的开发体验，没有过多的冗余代码，可以让开发者专注于业务逻辑
- 既可集成式也可分布式的配置文件，内建且可拓展的配置模型
- 可热重载的插件机制与服务机制，同时还能提供自定义事件
- 高度可拓展的事件响应器，能够依托强大的、符合直觉依赖注入进行会话控制
- 内置强大的命令系统、定时任务系统与多种插件

## 安装

基础安装 (只包含核心功能):
:::code-group
```bash:no-line-numbers [pdm]
pdm add "arclet-entari"
```

```bash:no-line-numbers [poetry]
poetry add "arclet-entari"
```

```bash:no-line-numbers [pip]
pip install "arclet-entari"
```
:::

完整安装 (包含YAML支持，文件监听等):
:::code-group
```bash:no-line-numbers [pdm]
pdm add "arclet-entari[full]"
```

```bash:no-line-numbers [poetry]
poetry add "arclet-entari[full]"
```

```bash:no-line-numbers [pip]
pip install "arclet-entari[full]"
```
:::

## 配置文件

每个 Entari 应用都有一个配置文件，它管理了应用及其插件的全部配置。Entari 支持多种配置文件格式, 包括 `JSON` 和 `YAML` 等, 也支持直接在代码中配置。

安装后, 可以通过命令行工具 `entari` 来生成配置文件:

```shell:no-line-numbers
$ entari config new --help
用法: entari config new [-d] [-P NAMES]

新建一个 Entari 配置文件

选项:
  -d, --dev             是否生成开发用配置文件
  -P, --plugins NAMES   指定增加哪些插件
```

`config new` 指令会根据当前环境选择一个合适的文件格式。
例如，若只进行了基础安装，则会生成一个 `.entari.json` 文件；若进行了完整安装，则会生成一个 `entari.yml` 文件。

以 `entari.yml` 为例, 生成的配置文件大致如下:

```yaml title=entari.yml
basic:
  network:
    - type: ws
      host: "127.0.0.1"
      port: 5140
      path: "satori"
  ignore_self_message: true
  log_level: INFO
  prefix: ["/"]
plugins:
  .record_message: {}
  ::echo: {}
  ::inspect: {}
```

### 基础配置

这里我们先解释 `basic` 部分：
- `network`: 网络配置, 可写多个网络配置
  - `type`: 网络类型, 可填项有 `ws`, `websocket`, `wh`, `webhook`
  - `host`: satori 服务器地址
  - `port`: satori 服务器端口
  - `path`: satori 服务器路径
- `ignore_self_message`: 是否忽略自己发送的消息事件
- `log_level`: 日志等级
- `prefix`: 指令前缀, 可留空

另外还有未列出的基础配置项：
- `skip_req_missing`: 是否在依赖缺失时跳过当前事件订阅者。参见 [监听事件](./letoderea.md#监听事件) 的相关内容。
- `cmd_count`: 指令数量限制, 默认为 4096
- `external_dirs`: 外部目录, 用于加载不在安装环境中的插件 (例如自定义插件), 可留空

### 插件配置

`plugins` 部分用于配置插件, 它的每一个键对应于插件的名称，而值则对应于插件的配置。当没有进行配置时，值可以省略 (或者写成 {})。当存在配置时，值需要在插件的基础上缩进并写在接下来的几行中。例如：

```yaml:no-line-numbers
plugins:
  foo:
    bar:
      key1: value1
      key2: value2
```

插件名称通常对应于插件发布时的包名。当某个插件的名称形如 `entari-plugin-xxx` 时，可以省略 `entari_plugin_` 前缀，直接写成 `xxx`。

除了插件的包名外，插件的名称还可以有几种类型的前缀:
- `::` 前缀表示内建插件。`::` 是对 `arclet.entari.builtins` 路径的省略。
- `.` 前缀表示特殊的 Rootless 插件，即不基于文件，而是通过一个函数定义的插件。它们通常用于一些简单的功能。
- `~` 前缀表示禁用插件。它的作用是将插件从配置中移除，而不是删除插件本身。

除了插件包名，plugins 还支持一些特殊的配置项:
- `$prelude`: 预加载插件列表。它的值是一个列表，包含了有必要先于其他插件加载的插件名称。
- `$$files`: 额外的插件配置文件搜索目录。通过该配置项，你可以将部分插件配置放在其他文件中，并通过该配置项指定这些文件的路径。

:::tip

某些情况下，省略 `entari_plugin_` 前缀后的插件名称可能会与环境中的其他包名冲突。又或者，插件包名的前缀并不符合 `entari_plugin_` 的规范。
此时可以通过配置 `$prefix` 来指定插件的前缀：
```yaml:no-line-numbers
plugins:
  foo:
    $prefix: "entari_plugin_"
```

:::

## 运行

:::warning

请确保在运行前已经运行了一个 `Satori` 服务器, 并且配置文件中的网络配置正确。

你可以通过如下途径搭建 Satori 服务器:

:::details 方法

- 运行 Koishi 实例（搭配 @koishijs/plugin-server。藉此可以对接其他平台）
- 安装 `nekobox` 并运行 `nekobox run` 命令
- 安装 `entar-plugin-server` 插件，然后配置 `plugins.server`：
  ```yaml
  plugins:
    server:
      adapters:
        - $path: package.module:AdapterClass
          # Following are adapter's configuration
          key1: value1
          key2: value2
      host: 127.0.0.1
      port: 5140
  ```
  此处的 `adapters` 可以参考 [satori.adapters](https://github.com/RF-Tar-Railt/satori-python/tree/main/src/satori/adapters)
:::


配置文件生成后, 可以直接通过指令运行：
```shell:no-line-numbers
$ entari run
2025-06-28 23:18:35 INFO    | [core] Entari version 0.13.1
...
```

或者编写入口文件:

```python title=main.py
from arclet.entari import Entari

app = Entari.load("entari.yml")
app.run()
```

倘若你没有配置文件, 也可以直接在代码中创建一个 `Entari` 实例并运行:

```python title=main.py
from arclet.entari import Entari, WS, load_plugin

app = Entari(
    WS(host="127.0.0.1", port=5140, path="satori"),
    ignore_self_message=True,
    log_level="INFO",
)

load_plugin(".record_message", {"record_send": True})
load_plugin("::echo")
load_plugin("::inspect")

app.run()
```

运行后，你便可以与机器人开始对话了。

<q-window title="Entari Test">
  <q-text name="Alice" self=true>/echo -h</q-text>
  <q-text name="Entari">
    echo &lt;...content&gt;
    <br/>
    显示消息
    <br/><br/>
    可用的选项有:
    <br/>
    *  发送转义消息
    <br/>&nbsp;&nbsp;--escape│-e
    <br/>
    *  发送反转义消息
    <br/>&nbsp;&nbsp;-E│--unescape
  </q-text>
  <q-text name="Alice" self=true>/echo hello world</q-text>
  <q-text name="Entari">hello world</q-text>
</q-window>


## 插件

如同配置文件一样，插件也是 Entari 的重要组成部分。它们可以扩展 Entari 的功能，提供更多的事件响应器、命令、定时任务等。
Entari 内置了一些插件，例如 `echo`、`inspect`、`help` 等。你可以在配置文件中启用它们，也可以通过代码加载它们。

想要创建一个新的插件，你可以使用 `entari plugin new` 命令来生成一个插件模板:

```shell:no-line-numbers
$ entari plugin new --help
用法: entari plugin new [-S] [-A] [-f]

新建一个 Entari 插件

选项:
  -S, --static          是否为静态插件
  -A, --application     是否为应用插件
  -f, --file            是否为单文件插件
```

其中对于 `--application` 选项，若你正在新建单个插件项目，则忽略这个选项；若你正在创建一个本地插件，则需要使用这个选项。

假设我们通过 `entari plugin new my_plugin --application --file` 创建了一个名为 `my_plugin` 的插件，那么它的目录结构大致如下:

```text:no-line-numbers
project/
├── plugins/
│   └── my_plugin.py
└── entari.yml
```

现在我们打开 `my_plugin.py` 文件，你会看到如下内容:

```python title=my_plugin.py
from arclet.entari import metadata

metadata(name="my_plugin")
```

这就是一个最简单的插件，它只包含了一个 `metadata` 调用。`metadata` 函数用于设置插件的元数据，例如名称、版本、作者等。

### 事件系统

`Entari` 的事件系统基于 [`Letoderea`](./letoderea.md). 也就是说你可以直接按照 [监听事件](./letoderea.md#监听事件) 的方式来注册事件监听器。

:::code-group
```python title=my_plugin.py {4-7} [通常形式]
import arclet.letoderea as leto
from arclet.entari import MessageCreatedEvent, Session

@leto.on(MessageCreatedEvent)
async def on_message_created(session: Session):
    if session.content == "ping":
        await session.send("pong")
```

```python title=my_plugin.py [使用过滤器] {5-8}
import arclet.letoderea as leto
from arclet.letoderea import deref
from arclet.entari import MessageCreatedEvent, Session

@leto.on(MessageCreatedEvent)
@leto.enter_if(deref(MessageCreatedEvent).message.content == "ping")
async def on_ping(session: Session):
    await session.send("pong")
```

:::

上述代码片段实现了一个简单的功能：当任何用户发送 "ping" 时，机器人会回复 "pong"。

其中，我们注入了一个 `session` 参数，它是一个 `Session` 实例，
在这个例子中，我们通过它访问事件相关的数据 (使用 `session.content` 获取消息的内容)，
并调用其上的 API 作为对此事件的响应 (使用 `session.send()` 在当前频道内发送消息)。

除开使用 `letoderea.on`, 你还可以通过获取 `Plugin` 实例来注册事件监听器:

:::code-group
```python title=my_plugin.py [Plugin.current()]
from arclet.entari import MessageCreatedEvent, Plugin, Session

plug = Plugin.current()

@plug.dispatch(MessageCreatedEvent)
async def on_message_created(session: Session):
    if session.content == "ping":
        await session.send("pong")
```

```python title=my_plugin.py [plugin]
from arclet.entari import MessageCreatedEvent, Session, plugin

@plugin.listen(MessageCreatedEvent)  # 与 `on` 等价
async def on_message_created(session: Session):
    if session.content == "ping":
        await session.send("pong")
```
:::

`Entari` 目前支持的事件有:
- 所有隶属于 `Satori` 的事件, 例如 `MessageCreatedEvent`, `FriendRequestEvent` 等
- 生命周期事件: `Startup`, `Ready`, `Cleanup` 和 `AccountUpdate`
- 插件事件: `PluginLoadedSuccess`, `PluginLoadedFailed`, `PluginUnloaded`
- 消息发送事件: `SendRequest`, `SendResponse`
- 插件配置事件: `ConfigReload`
- 指令事件: `CommandExecute`, `CommandReceive`, `CommandParse`, `CommandOutput`

:::tip

你可以直接通过 `Entari.on_message()` 装饰器来注册一个最小的事件响应器:

:::details 复读

```python title=main.py {5-7}
from arclet.entari import Session, Entari, WS

app = Entari(WS(host="127.0.0.1", port=5140, path="satori"))

@app.on_message()
async def repeat(session: Session):
    await session.send(session.content)

app.run()
```
:::

### 指令系统

一个机器人的绝大部分功能都是通过指令提供给用户的。Entari 的指令系统基于 [`Alconna`](./alconna/v1.md)，能够高效地处理大量消息的并发调用，同时还提供了快捷方式、调用前缀、速率限制、本地化等大量功能。
它本质上属于消息事件响应器的一个[前置传播者](./letoderea.md#传播)，允许开发者通过定义指令来处理用户输入的命令。

指令的注册分为两种：
- 通过 `command.on` 或 `command.command` 装饰器注册的指令
- 通过 `command.mount` 传入一个 Alconna 实例进行响应器注册

对于一个简单的 `echo` 指令，你可以这样编写:

:::code-group
```python title=my_plugin.py [command.on+str] {3-5}
from arclet.entari import command

@command.on("echo {content}")
def echo_(content: str):
    return content
```

```python title=my_plugin.py [command.command] {3-5}
from arclet.entari import MessageChain, command

@command.command("echo <...content>")
def echo_(content: command.Match[MessageChain]):
    return content.result
```

```python title=my_plugin.py [command.on+Alconna] {6-8}
from arclet.alconna import Alconna, Args, AllParam
from arclet.entari import MessageChain, command

alc = Alconna("echo", Args["content", AllParam])

@command.on(alc)
def echo_(content: command.Match[MessageChain]):
    return content.result
```

```python title=my_plugin.py [command.mount] {5-9}
from arclet.alconna import Alconna, Args, AllParam
from arclet.entari import MessageChain, Session, command

alc = Alconna("echo", Args["content", AllParam])
disp = command.mount(alc)

@disp.handle()
async def echo_(content: command.Match[MessageChain], session: Session):
    await session.send(content.result)
```
:::

还记得 `prefix` 配置项吗？无论是 `command.on`, `command.command` 还是 `command.mount`, 它们都有三个通用的参数:
- `need_reply_me`: 该指令是否需要回复机器人
- `need_notice_me`: 该指令是否需要 @ 机器人
- `use_config_prefix`: 是否使用配置文件中的前缀 (默认为 `True`)

当我们配置了 `prefix` 时，Entari 会在指令触发后对消息内容进行处理，判断是否以配置的前缀开头，并去除前缀后再进行指令匹配。

:::tip 

对于 `command.xxxx`, 其可以通过配置文件去设置全局性的指令配置项，例如 `need_reply_me` 和 `need_notice_me`。
```yaml:no-line-numbers title=entari.yml
plugins:
  .commands:
    need_notice_me: true
    use_config_prefix: false
```

:::


### 配置模型

我们已经知道了插件是可以接受配置的，那么如何在插件中使用配置呢？
`Entari` 提供了 `plugin_config` 函数来获取插件的配置。它会根据参数的不同返回不同的配置类型，即：

- `plugin_config()` 返回插件的配置字典；
- `plugin_config(XXX)` 返回插件的配置模型 `XXX` 的实例。

Entari 并未限制配置模型的类型，你可以使用任何注册了配置相关功能的配置模型类。
Entari 内建了如下模型类：
- `BasicConfModel`: 基于 `dataclass` 的基础配置模型
- `::model.BaseModel`: 基于 `Pydantic` 的配置模型
- `::model.Struct`: 基于 `msgspec` 的配置模型

前者是 Entari 的默认配置模型，后者需要安装 `pydantic` 或 `msgspec`, 然后导入 `arclet.entari.builtins.model` 插件才能使用。

以 `BasicConfModel` 为例，我们可以这样定义一个配置模型:

```python title=my_plugin.py
from arclet.entari import BasicConfModel, metadata, plugin_config

class MyPluginConfig(BasicConfModel):
    foo: str
    bar: int = 42

metadata(name="my_plugin", config=MyPluginConfig)

conf = plugin_config(MyPluginConfig)
```

在这个例子中，我们定义了一个名为 `MyPluginConfig` 的配置模型，它包含两个字段：`foo` 和 `bar`。其中 `bar` 有一个默认值 `42`。
当插件加载时，Entari 会自动读取配置文件中的 `my_plugin` 部分，并将其转换为 `MyPluginConfig` 的实例。

:::details 配置文件示例

假设我们在配置文件中添加了如下内容:
```yaml:no-line-numbers title=entari.yml
...
plugins:
  my_plugin:
    foo: "Hello, World!"
    bar: 100
```

那么在插件加载后，`conf` 的值将是:
```python
>>> print(conf)
MyPluginConfig(foo="Hello, World!", bar=100)
```
:::

### 生命周期

上面提到过，Entari 提供了生命周期事件。这些事件会在某些 Entari 的运行阶段被触发，你可以通过监听它们来实现各种各样的功能。

- `Startup`: 在 Entari 启动时触发。此时各种服务仍然处于准备阶段，尚未开始运行。你可以在这个事件中进行一些初始化操作，例如加载数据等。
- `Ready`: 在 Entari 准备就绪时触发。如果一个插件在加载时，Entari 已经处于 Ready 状态，则会对该插件立即触发 Ready 事件。建议在以下场景使用:
  - 需要在所有插件加载完成后进行一些操作
  - 动态导入其他插件
- `Cleanup`: 在 Entari 关闭时触发。此时所有服务正处于关闭阶段，你可以在这个事件中进行一些清理操作，例如保存数据等。
- `AccountUpdate`: 某个登陆号的状态发生变化时触发。你可以在这个事件中进行一些账号状态的更新操作，例如连接后主动发送消息等。

对于监听生命周期事件，你可以导入 `arclet.entari.lifecycle` 模块中的事件类，并使用 `@on` 装饰器进行注册，或使用 `plugin.use` 装饰器进行注册。

:::code-group
```python title=my_plugin.py [listen/dispatch]
from arclet.entari import Ready, Plugin

plug = Plugin.current()

@plug.listen(Ready)
async def on_ready():
    print("Entari is ready!")
```

```python title=my_plugin.py [plugin.use]
from arclet.entari import Plugin

plug = Plugin.current()

@plug.use("::ready")
async def on_ready():
    print("Entari is ready!")
```
:::

### 副作用

Entari 支持在运行时卸载插件。你可以直接调用 `unload_plugin` 函数来卸载一个插件。

```python
from arclet.entari import unload_plugin

unload_plugin("my_plugin")
```

这将会卸载名为 `my_plugin` 的插件，并触发 `PluginUnloaded` 事件。

Entari 的插件系统支持热重载，即任何一个插件可能在运行时被多次加载和卸载。要实现这一点，我们就必须在插件被卸载时清除它的所有副作用。

大部分情况下，Entari 会自动清除插件的副作用，例如事件监听器、指令、上游插件导入等。但是有些情况下，你可能需要手动清除副作用。这时候就需要通过 `collect_disposes` 方法来注册该插件的副作用清理函数。

```python title=my_plugin.py
from arclet.entari import collect_disposes
from xxx import global_list

# 副作用
global_list.append("my_plugin")
# 清理副作用
collect_disposes(lambda: global_list.remove("my_plugin"))
```

:::tip

然而，在某些情况下，我们需要确保一些数据在整个 Entari 运行期间保持不变。
这时可以使用 `keeping` 方法包装一个对象，使其在插件卸载时不会被清除。

```python title=my_plugin.py
from arclet.entari import keeping

my_data = keeping("my_data", {"key": "value"}, lambda x: x.clear())
```

这样，即使 `my_plugin` 多次加载和卸载，`my_data` 内的数据也会保持不变。

:::

### 服务

在 Entari 中，服务特指继承自 `launart.Service` 的类。它们依据 [`Launart`](https://graia.cn/other/launart/) 的设计理念，提供了一种轻量级的服务注册和管理方式。
对于插件而言，它能通过服务向其他插件提供拓展功能。例如 `browser` 插件便启用了 `PlaywrightService` 服务来提供浏览器相关的功能。所有服务都能通过依赖注入的方式被其他插件使用。

在插件中定义的服务需要通过 `add_service` 方法记录下来。Entari 会在插件加载时自动注册这些服务，并在插件卸载时自动清理它们。

:::details 服务示例
```python title=my_plugin.py
from launart import Service, Launart
from arclet.entari import add_service

# 定义一个缓存服务
class CacheService(Service):
    id = "my_cache_service"

    @property
    def required(self):
        return set()

    @property
    def stages(self):
        return {"blocking", "cleanup"}

    def __init__(self):
        super().__init__()
        self.cache = {}
    
    def get(self, key):
        return self.cache.get(key)

    def set(self, key, value):
        self.cache[key] = value

    async def launch(self, manager: Launart):
        async with self.stage("blocking"):
            await manager.status.wait_for_sigexit()
        async with self.stage("cleanup"):
            self.cache.clear()

# 注册服务
add_service(CacheService)
```

然后在其他插件中，你可以通过依赖注入直接获取这个服务:

```python title=other_plugin.py
from arclet.entari import MessageCreatedEvent, plugin
from my_plugin import CacheService  # entari: plugin

@plugin.listen(MessageCreatedEvent)
async def on_message_created(event: MessageCreatedEvent, cache_service: CacheService):
    cache_service.set(event.message_id, event.content)
```

:::

### 依赖与子插件

上面我们提到，一个插件可以依赖于其他插件（通过导入其他插件）。但是某些情况下，你导入的插件可能并未在配置文件中提及，即系统无法得知该导入是一个 Entari 插件。
针对这种情况，Entari 规定：通过 `# entari: plugin` 注释来标记某些导入为 Entari 插件。

```python title=my_plugin.py
from other_plugin import some_function  # entari: plugin
...
```

Entari 会自动记录插件之间的依赖关系。当一个上游插件被卸载时，Entari 会自动卸载所有依赖于它的下游插件。而当一个下游插件被卸载时，Entari 会自动清理仅有它依赖的上游插件。
例如，`bar` 依赖于 `foo`。当 `foo` 被卸载时，Entari 会自动卸载 `bar`。而当 `bar` 被卸载时，Entari 会检查 `foo` 是否还有其他下游插件依赖于它，如果没有，则会卸载 `foo`。

除了声明为插件外，Entari 还支持子插件的概念。子插件是指在一个插件中定义的其他插件，它们会跟随主插件的状态。同时，若子插件更新，主插件也会自动更新。

```python title=my_plugin.py
from foo import AAA # entari: subplugin
from bar import BBB # entari: package
...
```

在这个例子中，`foo` 和 `bar` 都是子插件。Entari 会自动记录它们的状态，并在主插件被卸载时自动卸载它们。

:::tip

若某个插件属于目录结构，则其所有子目录下的 Python 文件都会被视为子插件。

```text
my_plugin/
├── __init__.py
├── foo.py
├── bar.py
├── baz/
│   └── qux.py
└── quux.py
```

在这个例子中，`my_plugin` 作为主插件，其下的 `foo.py`、`bar.py`、`baz/qux.py` 和 `quux.py` 都会被视为子插件。

:::

### 过滤器

默认情况下，一个会话事件、中间件或者指令都对所有的会话生效。但如果我们希望这些功能只对部分群聊或者用户生效，我们就需要用到 **过滤器**。
过滤器的概念已经在 [`Letoderea`](./letoderea.md#过滤器) 中介绍过了。Entari 在此基础上提供了更为简洁的语法来使用过滤器。

Entari 的过滤器可以通过 `@filter_` 装饰器来使用:

```python title=my_plugin.py
from arclet.entari import MessageCreatedEvent, Session, filter_, plugin

@plugin.listen(MessageCreatedEvent)
@filter_.public & filter_.user("123456789")  # 只对公开群聊，并且用户 ID 为 123456789 的用户生效
async def on_message(session: Session):
    await session.send("Hello, World!")
```

但是在源码中直接书写账号或群号会导致隐私泄露，并且其他用户无法使用你的插件。Entari 提供了在配置文件中定义过滤器的方式:

```yaml:no-line-numbers title=entari.yml
plugins:
  my_plugin:
    $allow:
      public: true
      user: ["123456789"]
```

这与上面的代码等价。Entari 会自动将配置文件中的过滤器转换为过滤器对象，并在运行时应用它们。

:::warning

目前而言，这种写法并不是很方便。我们会在图形化界面实现后再来完善这个功能。

:::

## 消息链

一个聊天平台所能发送或接收的内容往往不只有纯文本。为此，我们引入了 **消息元素 (Element)** 和 **消息链 (MessageChain)** 的概念。

常见的消息元素有:
```python:no-line-numbers
At("123456789")  # @某个用户
At(type="all")  # @全体成员
Image(src="https://vitepress.dev/vitepress-logo-mini.svg")  # 图片
Quote(id="xxxxx", content=["Hello!"]) # 引用某条消息
```

<q-window title="消息元素示例">
  <q-text name="Entari"><a at>@123456789</a></q-text>
  <q-text name="Entari"><a at>@全体成员</a></q-text>
  <q-image name="Entari" src="https://vitepress.dev/vitepress-logo-mini.svg" alt="[图片]"/>
  <q-reply name="Entari" replyText="原消息文本">Hello!</q-reply>
</q-window>

你可以在这里找到所有内建的消息元素：[`标准元素`](https://satori.js.org/zh-CN/protocol/elements.html)

而在此基础上，Entari 还提供了一个 `MessageChain` 类来表示一条消息。它可以包含多个消息元素，并且支持各种操作，例如拼接、转换等。

最基础的使用方式是直接将消息元素传入 `MessageChain` 的构造函数:

```python:no-line-numbers
from arclet.entari import MessageChain, At, Image

msg = MessageChain("Hello")
msg1 = MessageChain(At("123456789"))
msg2 = MessageChain(["Hello", Image(src="https://example.com/image.png")])
```

`MessageChain` 还支持拼接操作:

```python:no-line-numbers
msg = MessageChain("Hello") + At("123456789") + Image(src="https://example.com/image.png")
```

或者像列表一样使用 `append` 和 `extend` 方法:

```python:no-line-numbers
msg = MessageChain()
msg.append(Text("Hello"))
msg.extend([At("123456789"), Image(src="https://example.com/image.png")])
```

而在处理收到的消息时，你同样可以使用 `MessageChain` 上的方法。

例如，例如，你想知道消息中是否包含图片，你可以这样做:

```python:no-line-numbers
answer1 = Image in message
answer2 = message.has(Image)
answer3 = bool(message.only(Image))
```

如果你想获取消息中的图片，你可以这样做:

```python:no-line-numbers
images1 = message[Image]
images2 = message.get(Image)
images3 = message.include(Image)
images4 = message.select(Image)
```

而后，如果你想提取图片中的链接，你可以这样做:

```python:no-line-numbers
urls = images1.map(lambda x: x.src)
```

## 定时任务

:::warning

该功能需要你安装额外依赖 (**如果你是完整安装则忽略此提示**):
::: code-group
```bash:no-line-numbers [pdm]
pdm add "arclet-entari[cron]"
```

```bash:no-line-numbers [poetry]
poetry add "arclet-entari[cron]"
```

```bash:no-line-numbers [pip]
pip install "arclet-entari[cron]"
```
:::

Entari 内置了一个定时任务插件，允许你注册定时任务、周期任务和延时任务。

首先，你需要在配置文件中启用 `.scheduler` 插件:
```yaml:no-line-numbers title=entari.yml
plugins:
  .scheduler: {}
```

随后，导入 `arclet.entari.scheduler` 模块，并使用 `@cron`, `@every` 或 `@invoke` 装饰器来注册定时任务:

:::code-group
```python title=my_plugin.py [@cron]
from arclet.entari import scheduler

@scheduler.cron("0 0 * * *")  # 每天午夜执行
async def daily_task():
    print("This task runs every day at midnight.")
```

```python title=my_plugin.py [@every]
from arclet.entari import scheduler

@scheduler.every(5, "minute")  # 每5分钟执行一次
async def periodic_task():
    print("This task runs every 5 minutes.")
```

```python title=my_plugin.py [@invoke]
from arclet.entari import MessageCreatedEvent, Session, scheduler, plugin

@plugin.listen(MessageCreatedEvent)
async def on_message(session: Session):
    if session.content == "start":
        resp = await session.send("This message will be deleted in 10 seconds.")
        @scheduler.invoke(10)
        async def delete_message():
            await session.message_delete(resp[0].id)
            print("Message deleted after 10 seconds.")
```
:::

## 热重载

Entari 支持热重载插件和配置文件。若需要启用该功能，你需要在配置文件中启用 `::auto_reload` 插件:

```yaml:no-line-numbers title=entari.yml
plugins:
  ::auto_reload:
    watch_dirs: ["."]
    watch_config: true
```

- `watch_dirs` 用于指定需要监视的目录，默认为当前目录。
- `watch_config` 用于指定是否监视配置文件的变化，默认为 `False`。

启用热重载后，Entari 会自动监视指定目录下的文件变化，并在文件变化时自动重载插件和配置文件。

:::details 热重载示例

假设我们在 `my_plugin.py` 中定义了一个插件，并启用了热重载:

```python title=my_plugin.py
from arclet.entari import MessageCreatedEvent, Session, plugin

@plugin.listen(MessageCreatedEvent)
async def on_message(session: Session):
    if session.content == "ping":
        await session.send("pong")
```

当我们运行 Entari 后，如果我们修改了 `my_plugin.py` 文件并保存，Entari 会自动检测到文件变化，并重新加载该插件。

```python title=my_plugin.py
from arclet.entari import MessageCreatedEvent, Session, plugin

@plugin.listen(MessageCreatedEvent)
async def on_message(session: Session):
    if session.content == "ping":
        await session.send("pong") # [!code --]
        await session.send("pongpongpong!") # [!code ++]
```

```shell:no-line-numbers
2025-06-30 00:44:14 INFO    | [core] Entari version 0.13.1
2025-06-30 00:44:14 SUCCESS | [plugin] loaded plugin 'arclet.entari.builtins.auto_reload'
2025-06-30 00:44:14 SUCCESS | [plugin] loaded plugin 'my_plugin'
...
2025-06-30 00:45:07 INFO    | [message] [热重载测试] Alice(@alice) -> 'ping'
... # 修改 my_plugin.py 后
2025-06-30 00:45:20 INFO    | entari [AutoReload] Detected change in 'my_plugin', reloading...
2025-06-30 00:45:20 INFO    | entari [AutoReload] Reloaded 'my_plugin'
...
2025-06-30 00:45:20 INFO    | [message] [热重载测试] Alice(@alice) -> 'ping'
```

<q-window title="热重载测试">
  <q-text name="Alice" self=true>ping</q-text>
  <q-text name="Entari">pong</q-text>
  <q-tip isTime=true>2025-06-30 00:45:20</q-tip>
  <q-text name="Alice" self=true>ping</q-text>
  <q-text name="Entari">pongpongpong!</q-text>
</q-window>
:::
