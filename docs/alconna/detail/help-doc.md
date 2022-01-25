---
id: help-doc
title: 内置帮助文档
---

# Help Doc
`Alconna` 支持通过`XXX.help("XXX")`来写入帮助说明,

以上面的指令为例：
```python
pip = Alconna(
    command="/pip",
    options=[
        Subcommand(
            "install", 
            Option("--upgrade").help("升级包"), 
            pak=str
        ).help("安装一个包"),
        Subcommand("show", pak=str).help("显示一个包的信息"),
        Subcommand("help", command=str).help("显示一个指令的帮助"),
        Option("list").help("列出所有安装的包"),
        Option("--retries", retries=int).help("设置尝试次数"),
        Option("-t| --timeout", sec=int).help("设置超时时间"),
        Option("--exists-action", ex_action=str).help("添加行为"),
        Option("--trusted-host", hostname=AnyUrl).help("选择可信赖地址")
    ]
).help("pip指令")
```
然后
```python
print(pip.get_help())
```
则有
```
/pip 
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