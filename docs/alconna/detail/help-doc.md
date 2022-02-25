---
id: help-doc
title: 内置帮助文档
---

## Help String
`Alconna` 支持通过`XXX.help("XXX")`来写入帮助说明,

以前面的指令为例：
```python
from arclet.alconna import Alconna, Subcommand, Option, Args
pip = Alconna(
    command="/pip",
    options=[
        Subcommand(
            "install", Option("--upgrade").help("升级包"), 
            args=Args["pak":str]
        ).help("安装一个包"),
        Subcommand("show", args=Args["pak":str]).help("显示一个包的信息"),
        Subcommand("help", args=Args["command":str]).help("显示一个指令的帮助"),
        Option("list").help("列出所有安装的包"),
        Option("--retries", Args["retries":int]).help("设置尝试次数"),
        Option("-t| --timeout", Args["sec":int]).help("设置超时时间"),
        Option("--exists-action", Args["action":str]).help("添加行为"),
        Option("--trusted-host", Args["host":"url"]).help("选择可信赖地址")
    ]
).help("pip指令")

print(pip.get_help())
```
则控制台会输出
```
/pip
pip指令
可用的子命令有:
# 安装一个包
  install <pak>
## 该子命令内可用的选项有:
 # 升级包
  --upgrade 
# 显示一个包的信息
  show <pak>
# 显示一个指令的帮助
  help <command>
可用的选项有:
# 列出所有安装的包
  list 
# 设置尝试次数
  --retries <retries>
# 设置超时时间
  --timeout <sec>
# 添加行为
  --exists-action <action>
# 选择可信赖地址
  --trusted-host <hostname>
```

`Alconna` 会自动判别每个command中的`Args`并转为参数列

## 内置选项 -h|--help

`Alconna` 会自动添加一个`-h|--help`选项，

当输入`xxx --help`或`xxx -h`时，`Alconna`会自动调用`xxx.get_help()`并传递给
Help选项的action中.

您可以使用`alconna.change_help_send_action()`来改变`-h|--help`的行为.

例如:
```python
from arclet.alconna import Alconna, change_help_send_action
change_help_send_action(lambda x: print(x))
alc = Alconna(
    command="test", foo=str, bar=int
).help("测试help直接发送")
```

当解析的消息为```test --help```时，会输出
```
test <foo> <bar>
测试help直接发送
```

:::caution

Help选项一旦被解析，则会自动判别为解析失败, 以防止后续的参数解析错误

:::