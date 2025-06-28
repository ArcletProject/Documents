---
prev: Letoderea
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

### 基础设置

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

### 插件设置

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

```python
from arclet.entari import Entari

app = Entari.load("config.yml")
app.run()
```

倘若你没有配置文件, 也可以直接在代码中创建一个 `Entari` 实例并运行:

```python
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

```python title=my_plugin.py {4-6}
import arclet.letoderea as leto
from arclet.entari import MessageCreatedEvent, Session

@leto.on(MessageCreatedEvent)
async def on_message_created(session: Session):
    if session.content == "ping":
        await session.send("pong")
```

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

### 指令系统

Entari 的指令系统基于 [`Alconna`](./alconna/v1.md). 其分为两种：
- 通过 `command.on` 或 `command.command` 装饰器注册的指令
- 通过 `command.mount` 传入一个 Alconna 实例进行响应器注册
