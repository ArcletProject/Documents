---
prev: Entari
next: 数据库插件
---

# 服务器插件

`entari-plugin-server` 属于官方插件，允许你在插件启动一个 ASGI 服务，并运行 Satori 服务器，以供 Entari 本体连接，并配合使用适配器。

## 安装

::: code-group
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

## 适配器

`entari-plugin-server` 支持加载适配器，适配器用于将不同的协议转换为 Satori 协议，从而使 Entari 能够与更多的服务进行交互。

适配器需要单独安装，安装后即可在配置文件中使用。

若 `direct_adapter` 配置为 `true`，则表示 Entari 将直接使用适配器进行通信，而不经过 Satori 服务器。此时你不需要声明基础配置的 `network` 字段。

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

**配置(反向)**：
- `prefix`: 反向适配器于 Server 的路径前缀, 默认为 `/`
- `path`: 反向适配器于 Server 的路径, 默认为 `onebot/v11`
- `endpoint`: 反向适配器于 Server 的路径端点, 默认为 `ws` (完整路径即为 `/onebot/v11/ws`)
- `access_token`: 反向适配器的访问令牌, 默认为空

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
