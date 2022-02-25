---
id: manager
title: 命令管理器
---

## CommandManager

命令管理器是一个单例, 负责管理`Alconna`命令的创建、查找、禁用、启用等操作。

命令管理器内部的结构如下:
```
Manager
├── Commands
│   ├── Namespace1
│   │   ├── name1: command1
│   │   ├── name2: command2
│   │   ├── name3: command3
│   │   └── ...
│   ├── Namespace2
│   │   ├── name1: command1
│   │   ├── name2: command2
│   │   ├── name3: command3
│   │   └── ...
│   └ ...
└── Abandon:
    ├── name1: command1
    ├── name2: command2
    └── name3: command3
```

默认使用`Alconna`作为命名空间，且同一命名空间下的命令名称不能重复。

## all_command_help
命令管理器的`all_command_help`方法返回所有命令的帮助信息。

该方法可以传入一`namespace`参数，表示只返回该命名空间下的命令的帮助信息。

```python
from arclet.alconna import Alconna
from arclet.alconna.manager import CommandManager
manager = CommandManager()
alc = Alconna.from_string("command1 #命令1")
alc1 = Alconna.from_string("command2 #命令2")
alc2 = Alconna.from_string("command3 #命令3")
...
print(manager.all_command_help())
```

其会输出:
``` title="all_command_help"
# 当前可用的命令有:
 - command1 命令1
 - command2 命令2
 - command3 命令3
# 输入'命令名 --help' 查看特定命令的语法
```

## broadcast
命令管理器的`broadcast`方法可以将命令发送给当前主程序下(包括导入的模块中的)注册的所有命令。

该方法可以传入一`namespace`参数，表示只会将命令发送给该命名空间下的`Alconna`命令。

## set_enable 与 set_disable
两种方法可以控制命令的启用与禁用。

方法需要传入一个`command`参数，表示要控制的命令。该参数可以是命令的名称，也可以是命令的实例。

```python
from arclet.alconna import Alconna
from arclet.alconna.manager import CommandManager
manager = CommandManager()
alc = Alconna.from_string("command1 #命令1")
alc1 = Alconna.from_string("command2 #命令2")
alc2 = Alconna.from_string("command3 #命令3")
manager.set_disable(alc2)
print("禁用命令3")
print(alc2.analyse_message("command3").matched)
print("启用命令3")
manager.set_enable("Alconna.command3")
print(alc2.analyse_message("command3").matched)
```

其会输出:
``` title="set_enable, set_disable"
禁用命令3
False
启用命令3
True
```
