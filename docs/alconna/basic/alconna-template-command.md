---
id: alconna-template-command
title: 命令节点
---

## TemplateCommand
`TemplateCommand`是`Alconna`的命令体基类，用来规范命令所需参数

`TemplateCommand`规定一个命令体需要如下参数:
 - name: 命令体名称
 - args: 命令体参数
 - separator: 命令体分隔符, 一般不需要传入
 - action: 参数对应的响应函数

## Action
`TemplateCommand` 可以传入一个`Action`, 这个Action应该是Callable的`function`， 或者是`ArgAction`类的实例

`Action`会在`Command`被成功匹配，或`Command`的`Args`被全部匹配完毕后执行，如

```python
TemplateCommand("test", actions=lambda x: True)  # 此时会使结果为{"test": True} 而不是 {"test": Ellipsis}
```
或
```python
TemplateCommand("test", Args["num":int], action=lambda x: x + 1)  # 此时会使结果为{"test": {"num": x+1}} 而不是 {"test": {"num": x}}
```

若`Args`有传入, 则`Action` 可以传入的参数的个数应该与`TemplateCommand`的`Args`给出的参数个数一致
```python
TemplateCommand("--foo", Args["bar":int], action=lambda x: 2*x)  # 合法
TemplateCommand("--foo", Args["bar":str, "bar1":bool], action=lambda x: x.strip())  # 非法
```

另外`Alconna`提供了预制的action, 你可以在`alconna.actions`里找到:
- store_bool: 存储一个布尔值
- store_const: 存储一个整数
- version: 返回一个以元组形式存储的版本信息