---
id: help-doc
title: 内置帮助文档
---

## Help String
`Alconna` 支持通过传入`help_text`参数, 来写入帮助说明,

以前面的指令为例：
```python
from arclet.alconna import Alconna, Subcommand, Option, Args
pip = Alconna(
    command="/pip",
    options=[
        Subcommand(
            "install", Option("--upgrade", help_text="升级包"), 
            args=Args["pak":str],
            help_text="安装一个包"
        ),
        Subcommand("show", args=Args["pak":str], help_text="显示一个包的信息"),
        Subcommand("help", args=Args["command":str], help_text="显示一个指令的帮助"),
        Option("list", help_text="列出所有安装的包"),
        Option("--retries", Args["retries":int], help_text="设置尝试次数"),
        Option("-t| --timeout", Args["sec":int], help_text="设置超时时间"),
        Option("--exists-action", Args["action":str], help_text="添加行为"),
        Option("--trusted-host", Args["host":"url"], help_text="选择可信赖地址")
    ],
    help_text="pip指令"
)

print(pip.get_help())
```
则控制台会输出
```
/pip
pip指令
可用的子命令有:
# 安装一个包
  install <pak:str>
## 该子命令内可用的选项有:
 # 升级包
  --upgrade 
# 显示一个包的信息
  show <pak:str>
# 显示一个指令的帮助
  help <command:str>
可用的选项有:
# 列出所有安装的包
  list 
# 设置尝试次数
  --retries <retries:int>
# 设置超时时间
  --timeout <sec:int>
# 添加行为
  --exists-action <action:str>
# 选择可信赖地址
  --trusted-host <host:url>
```

`Alconna` 会自动判别每个command中的`Args`并转为参数列

## 内置选项 -h|--help

`Alconna` 会自动添加一个`-h|--help`选项，

当输入`xxx --help`或`xxx -h`时，`Alconna`会自动调用`xxx.get_help()`并传递给
Help选项的action中.

您可以使用`alconna.change_help_send_action()`来改变`-h|--help`的行为.

例如:
```python
from arclet.alconna import Alconna, Args, require_help_send_action
require_help_send_action(lambda x: print(x))
alc = Alconna(
    command="test", main_args=Args["foo":str, "bar":str],
    help_text="测试help直接发送"
)
```

当解析的消息为```test --help```时，会输出
```
test <foo:str> <bar:str>
测试help直接发送
```

:::caution

Help选项一旦被解析，则会自动判别为解析失败, 以防止后续的参数解析错误

:::