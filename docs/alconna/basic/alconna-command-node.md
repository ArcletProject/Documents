---
id: alconna-command-node
title: 命令节点
---

## CommandNode
`CommandNode`是`Alconna`的命令体基类，用来规范命令所需参数

`CommandNode`规定一个命令体需要如下参数:
 - name: 命令体名称, 为string类型
 - args: 命令体参数, 为`Args`类型
 - separator: 命令体分隔符, 一般不需要传入
 - action: 参数对应的响应函数, 为`ArgAction`类型
 - help_text: 命令体的帮助说明, 为string类型

### Args

构造`CommandNode`时, 可以用三种方式传入`Args`

1.正常方式构造`Args`:
```python
from arclet.alconna.base import CommandNode, Args
CommandNode(name='test', args=Args(key1='value1', key2='value2'))
```
2.魔术方式构造`Args`:
```python
from arclet.alconna.base import CommandNode, Args
CommandNode(name='test', args=Args['key1':'value1', 'key2':'value2'])
```

3.纯文字传入`Args`:
```python
from arclet.alconna.base import CommandNode
CommandNode(name='test', args="key1:value1, key2:value2")
```

关于`Args`的构造方式, 可以参考`Args`的[说明](./alconna-args.mdx)

## Action
`CommandNode` 可以传入一个`Action`, 这个Action应该是Callable的`function`， 或者是`ArgAction`类的实例

`Action`会在`Command`被成功匹配，或`Command`的`Args`被全部匹配完毕后执行，如

```python
from arclet.alconna.base import CommandNode
 # 此时会使结果为{"test": True} 而不是 {"test": Ellipsis}
CommandNode("test", action=lambda x: True)
```
或
```python
from arclet.alconna.base import CommandNode, Args
# 此时会使结果为{"test": {"num": x+1}} 而不是 {"test": {"num": x}}
CommandNode("test", Args["num":int], action=lambda x: x + 1)
```

若`Args`有传入, 则`Action` 可以传入的参数的个数应该与`CommandNode`的`Args`给出的参数个数一致
```python
from arclet.alconna.base import CommandNode, Args
# 合法
CommandNode("--foo", Args["bar":int], action=lambda x: 2*x)
# 非法
CommandNode("--foo", Args["bar":str, "bar1":bool], action=lambda x: x.strip())
```

在 Alconna 0.7.4后, 你可以直接传入一个Callable的`function`而不传入`Args`, 内部会根据函数自动生成`Args`:
```python
from arclet.alconna.base import CommandNode

def test(num: int):
    return num + 1
CommandNode("test", action=test)
```
这等同于:
```python
from arclet.alconna.base import CommandNode, Args

def test(num: int):
    return num + 1
CommandNode("test", Args["num":int], action=test)
```

另外`Alconna`提供了预制的action, 你可以在`alconna.builtin.actions`里找到:
- store_bool: 存储一个布尔值
- store_const: 存储一个整数
- version: 返回一个以元组形式存储的版本信息