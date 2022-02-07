---
id: hello-world
title: Edoves 快速入门
---

:::note

Edoves 最新版本 (0.0.14) 仅部分实现实现了 MAH 支持, 所以我们在此仅使用来自 mirai/mirai-api-http 的 Tencent QQ 协议支持

但理论上, 以下实现也应可以使用:
- miraigo/onebot(go-cqhttp)
- miraijvm/cqhttp-mirai (onebot)
- oicq.js/onebot (onebot)

:::

## 准备工作

我们假设在你使用 Edoves 前已经阅读了[`mirai-console-loader`](https://github.com/iTXTech/mirai-console-loader) 与 [`mirai-api-http`](https://github.com/mamoe/mirai-api-http) 的 README, 
并且启动了你的 `mirai-console` , 同时也安装了最新版本的 `mirai-api-http` 插件. 

### python

Edoves 需要 **Python 3.8 及以上版本。**

### mirai-api-http 配置

找到你的mcl所在的文件夹，在`.config\net.mamoe.mirai-api-http\` 下找到 `setting.yml` 文件

确保启用了 http 与 ws 的 adapter, 并且端口号相同

完成后，运行 mirai-console，登录你的机器人账号。

## 安装

从 PyPi 安装:
```
pip install --upgrade arclet-edoves
```

## 你的第一个程序，Hello,World!

将以下代码保存到文件 `bot.py` 内, 确保该文件位于你的工作区内:
```python
from arclet.edoves.builtin.mah.module import MessageModule
from arclet.edoves.builtin.mah import MAHConfig
from arclet.edoves.builtin.medium import Message
from arclet.edoves.builtin.event.message import MessageReceived
from arclet.edoves.builtin.client import AioHttpClient
from arclet.edoves.main import Edoves


async def test_message_reaction(message: Message):
    if message.content.startswith("Hello"):
        await message.set("Hello World!").send()


app = Edoves(
    configs={
        "MAH-default": (
            MAHConfig,
            {"verify_token": "INITKEYWylsVdbr", "port": "9080", "client": AioHttpClient, "account": 3542928737}
        )
    },
)

message_module = app['MAH-default'].activate_module(MessageModule)
message_module.add_handler(MessageReceived, test_message_reaction)

app.run()
```

记得把QQ号改成你自己的，`verify_key` `host` 和 `port` 也要和 setting.yml 的配置一致

然后运行代码

终端：
```
2022-01-26 | INFO     | arclet.edoves.utilles.logger - --------------------------------------------------------
2022-01-26 | INFO     | arclet.edoves.main - MAHProtocol activate successful
2022-01-26 | INFO     | arclet.edoves.main.scene - ChatLogModule activate successful

```

当出现 `MAHServerDocker connected.` 后, 请尝试与机器人账号发起好友对话, 如果你向机器人发送 Hello , 
并且机器人向你发出 Hello, World! 的话, 恭喜你, 你就已经实现了一个Edoves应用了.

<div>
    <ul>
        <li class="chat right">Hello</li>
        <li class="chat left">Hello World!</li>
    </ul>
</div>


> 停下来？ 按 Ctrl + C 停止。

:::caution

倘若出现 "XXX does not supply the dock server you chosen" 的日志, 请检查对应模块的id

倘若出现 "Cannot connect to host localhost:xxx ssl:default [远程计算机拒绝网络连接。]", 请检查网络

:::