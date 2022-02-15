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
    └── name1: command1
    └── name2: command2
    └── name3: command3
```

默认使用`Alconna`作为命名空间，且同一命名空间下的命令名称不能重复。

