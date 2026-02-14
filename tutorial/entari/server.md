---
prev: Entari
next: 数据库插件
---

# 服务器插件

`entari-plugin-server` 属于官方插件，允许你在插件启动一个 ASGI 服务，并运行 Satori 服务器，以供 Entari 本体连接，并配合使用适配器。

## 安装

::: code-group
```bash:no-line-numbers [entari-cli]
entari add server
```

```bash:no-line-numbers [pdm]
pdm add entari-plugin-server
```

```bash:no-line-numbers [uv]
uv add entari-plugin-server
```

```bash:no-line-numbers [pip]
pip install entari-plugin-server
```
:::

## 配置项
- `adapters`: 适配器配置列表。
    每个适配器配置项均为一个字典，必须包含 `$path` 键，表示适配器的路径。
    其他键值对将作为适配器的配置项传递给适配器类的构造函数。
    已知适配器请参考下方的官方适配器和社区适配器部分。
- `direct_adapter`: 是否使用直连适配器。
    直连适配器的情况下，App 将直接与 Server 插件通信，而不通过网络请求。
    也就是说，不再需要填写基础配置项 `network`
- `transfer_client`: 是否将 Entari 客户端收到的事件转发给连接到 server 的其他 Satori 客户端。
    开启转发的情况下，Server 插件将作为一个中继，转发事件给所有连接的客户端。
    并且客户端的响应调用，Server 插件也将一并转发回上游。
- `host`: 服务器主机地址，默认为 `127.0.0.1`
- `port`: 服务器端口，默认为 `5140`
- `path`: 服务器部署路径，默认为空字符串 `""`
- `version`: 服务器使用的协议版本，默认为 `v1`
- `token`: 服务器访问令牌，如果为 `None` 则不启用令牌验证，默认为 `None`
- `options`: Uvicorn 的其他配置项，默认为 `None`。此处参考 [Uvicorn 配置项](https://www.uvicorn.org/settings/)
- `stream_threshold`: 流式传输阈值，超过此大小将使用流式传输，默认为 `16 * 1024 * 1024` (16MB)
- `stream_chunk_size`: 流式传输分块大小，流式传输时每次发送的数据大小，默认为 `64 * 1024` (64KB)


## 适配器

`entari-plugin-server` 支持加载适配器，适配器用于将不同的协议转换为 Satori 协议，从而使 Entari 能够与更多的服务进行交互。

适配器需要单独安装，安装后即可在配置文件中使用。

### Satori适配器

**安装**：

:::code-group
```bash:no-line-numbers [pdm]
pdm add satori-python-adapter-satori
```

```bash:no-line-numbers [uv]
uv add satori-python-adapter-satori
```

```bash:no-line-numbers [pip]
pip install satori-python-adapter-satori
```
:::

**路径(`$path`)**： `@satori`

**配置**：
- `host`: 对接的 Satori Server 的地址，默认为`localhost`
- `port`: 对接的 Satori Server 的端口，默认为`5140`
- `path`: 对接的 Satori Server 的路径，默认为`""`
- `token`: 对接的 Satori Server 的访问令牌，默认为空
- `post_update`: 是否接管资源上传接口，默认为`False`

```yaml:no-line-numbers
adapters:
  - $path: @satori
    host: localhost
    port: 5140
    path: "satori"
    token: "your_token"
    post_update: true
```

### OneBot V11适配器

**安装**：
:::code-group
```bash:no-line-numbers [pdm]
pdm add satori-python-adapter-onebot11
```

```bash:no-line-numbers [uv]
uv add satori-python-adapter-onebot11
```

```bash:no-line-numbers [pip]
pip install satori-python-adapter-onebot11
```
:::

**路径(`$path`)**： `@onebot11.forward` 或 `@onebot11.reverse` (正向或反向适配器)

**配置(正向)**：
- `endpoint`: 连接 OneBot V11协议端的路径
- `access_token`: OneBot V11协议的访问令牌, 默认为空
- `timeout`: 发送请求的超时时间，默认为 30 秒

```yaml:no-line-numbers
adapters:
  - $path: @onebot11.forward
    endpoint: "http://localhost:8081"
    access_token: "your_token"
```

**配置(反向)**：
- `prefix`: 反向适配器于 Server 的路径前缀, 默认为 `/`
- `path`: 反向适配器于 Server 的路径, 默认为 `onebot/v11`
- `endpoint`: 反向适配器于 Server 的路径端点, 默认为 `ws` (完整路径即为 `/onebot/v11/ws`)
- `access_token`: 反向适配器的访问令牌, 默认为空
- `timeout`: 发送请求的超时时间，默认为 30 秒

```yaml:no-line-numbers
adapters:
  - $path: @onebot11.reverse
    path: "onebot/v11"
    endpoint: "ws"
    access_token: "your_token"
```

### Console适配器

**安装**：
:::code-group
```bash:no-line-numbers [pdm]
pdm add satori-python-adapter-console
```

```bash:no-line-numbers [uv]
uv add satori-python-adapter-console
```

```bash:no-line-numbers [pip]
pip install satori-python-adapter-console
```
:::

**路径(`$path`)**： `@console`

**配置**：参考 [`ConsoleSetting`](https://github.com/nonebot/nonechat/blob/main/nonechat/setting.py)

```yaml:no-line-numbers
adapters:
  - $path: @console
    title: "控制台"
    user_name: "用户"
    bot_name: "机器人"
    # 其他配置项参考 ConsoleSetting
```

### Milky 适配器

**安装**：

:::code-group
```bash:no-line-numbers [pdm]
pdm add satori-python-adapter-milky
```

```bash:no-line-numbers [uv]
uv add satori-python-adapter-milky
```

```bash:no-line-numbers [pip]
pip install satori-python-adapter-milky
```
:::

**路径(`$path`)**： `@milky.main` 或 `@milky.webhook` (websocket 或 webhook 适配器)

**配置(Websocket)**：
- `endpoint`: 连接 Milky 协议端的路径
- `token`: Milky 协议的访问令牌, 默认为空
- `token_in_query`: 是否将 token 放在查询参数中, 默认为`False`
- `headers`: 连接时使用的自定义请求头, 默认为空字典

```yaml:no-line-numbers
adapters:
  - $path: @milky.main
    endpoint: "ws://localhost:8082/milky"
    token: "your_token"
```

**配置(Webhook)**：
- `endpoint`: 连接 Milky 协议端的路径 (用于发送请求)
- `token`: Milky 协议的访问令牌, 默认为空
- `headers`: 连接时使用的自定义请求头, 默认为空字典
- `path`: Webhook 适配器于 Server 的路径, 默认为 `/milky`
- `self_token`: Webhook 适配器的访问令牌, 默认为空

```yaml:no-line-numbers
adapters:
  - $path: @milky.webhook
    endpoint: "http://localhost:8082/milky"
    token: "your_token"
    self_token: "milky_webhook_token"
```

### QQ 适配器

**安装**：

:::code-group

```bash:no-line-numbers [pdm]
pdm add satori-python-adapter-qq
```

```bash:no-line-numbers [uv]
uv add satori-python-adapter-qq
```

```bash
pip install satori-python-adapter-qq
```

:::

**路径(`$path`)**： `@qq.main` 或 `@qq.websocket` (webhook 适配器或 websocket 适配器)

**配置(Webhook)**：
- `secrets`: QQ 机器人的 app_id 和 app_secret 的映射字典，格式为 `{app_id: app_secret}`
- `path`: Webhook 适配器于 Server 的路径, 默认为 `/qqbot`
- `certfile`: SSL 证书文件路径，默认为空 (等同于设置本插件的配置项 `options` 中的 `ssl_certfile`)
- `keyfile`: SSL 密钥文件路径，默认为空 (等同于设置本插件的配置项 `options` 中的 `ssl_keyfile`)
- `verify_payload`: 是否验证请求负载的签名，默认为`True`
- `is_sandbox`: 是否连接到 QQ 机器人的沙箱环境，默认为`False`

```yaml:no-line-numbers
adapters:
  - $path: @qq.main
    secrets:
      "10xxxxxxx": xxxxxxxx
    path: "/qq"
    certfile: "/path/to/domain.crt"
    keyfile: "/path/to/domain.key"
    verify_payload: true
```

**配置(Websocket)**：
- `app_id`: QQ 机器人的应用 ID
- `secret`: QQ 机器人的应用密钥
- `token`: 连接 QQ 机器人的访问令牌
- `shard`: 分片信息，格式为 `(shard_id, shard_count)`，默认为空
- `intent`: 该 QQ 机器人的事件订阅掩码，具体请参考 [QQ 机器人文档](https://bot.q.qq.com/wiki/develop/api-v2/dev-prepare/interface-framework/event-emit.html#%E4%BA%8B%E4%BB%B6%E8%AE%A2%E9%98%85intents):
  - `guilds`: 频道和子频道相关事件，默认开启
  - `guild_members`: 频道成员相关事件，默认开启
  - `guild_messages`: 私域机器人下的频道消息事件，默认**关闭**
  - `guild_message_reactions`: 频道消息表态事件，默认**开启**
  - `direct_message`: 频道私信事件，默认**关闭**
  - `c2c_group_at_messages`: 单聊和群聊事件 (单聊消息、群 @ 消息等)，默认**关闭**
  - `interaction`: 按钮互动事件，默认**关闭**
  - `message_audit`: 频道消息审核事件，默认**开启**
  - `forum_event`: 论坛频道相关事件，仅 *私域* 机器人能够设置此 intents，默认**关闭**
  - `audio_action`: 语音频道相关事件，默认**关闭**
  - `at_messages`: 公域机器人下的频道消息事件，默认**开启**
- `is_sandbox`: 是否连接到 QQ 机器人的沙箱环境，默认为`False`

```yaml:no-line-numbers
adapters:
  - $path: @qq.websocket
    app_id: "10xxxxxxx"
    secret: "xxxxxxxx"
    token: "your_token"
    intent:
      guild_messages: true
      at_messages: false
```

### Lagrange适配器

**安装**：
:::code-group
```bash:no-line-numbers [pdm]
pdm add nekobox
```

```bash:no-line-numbers [uv]
uv add nekobox
```

```bash:no-line-numbers [pip]
pip install nekobox
```
:::

**路径(`$path`)**： `nekobox.main`

**配置**：
- `uin`: 登录的QQ号
- `sign_url`: 签名服务器的URL
- `protocol`: 使用的协议类型，默认为`linux`，可选值为 `linux`，`macos`, `windows`, `remote`
- `log_level`: 日志级别，默认为`INFO`
- `use_png`: 登录二维码是否保存为PNG图片，默认为`False`
