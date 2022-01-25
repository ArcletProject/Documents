---
id: usage
title: Alconna 的应用
---

## 奇奇怪怪的命令

`Alconna` 的 `command`支持写入正则表达式, 所以以下命令是可以的

```python
>>> w = Alconna(command=f"查询{AnyStr}天气")
>>> d = Alconna(headers=["."], command=f"d{AnyDigit}")
>>> w.analyse_message("查询北京天气").header
'北京'
>>> d.analyse_message(".d100").header
'100'
```

## 选项的多参数

`Option` 与 `Subcommand` 的 `args` 可以填入不止一个参数，所以以下命令是可以的

```python
>>> cal = Alconna(command="Cal",options=[Option("-sum", num_a=AnyDigit, num_b=AnyDigit)])
>>> msg = "Cal -sum 12 23"
>>> cal.analyse_message(msg).get('sum')
{'num_a': '12', 'num_b': '23'}
>>> cal = Alconna(command="Cal",options=[Subcommand("-div", Option("--round", Args(decimal=AnyDigit)), num_a=AnyDigit, num_b=AnyDigit)])
>>> msg = "Cal -div 12 23 --round 2"
>>> cal.analyse_message(msg).get('div')
{'num_a': '12', 'num_b': '23', 'round': {'decimal': '2'}}
```
> PS. Alconna在解析完成后会把破折线给过滤掉

## 自定义分隔符

`Alconna` 不强制 shell-like 的指令，所以以下命令是可以的

```python
>>> alc = Alconna(
...     command=f"{AnyStr}今天", 
...     main_args=Args["item":AnyParam],
...     actions=lambda x: x.split("和")
... ).separate("吃")
>>> alc.analyse_message("叔叔今天吃什么啊?").header
'叔叔'
>>> alc.analyse_message("叔叔今天吃tm和tm呢").item
['tm', 'tm呢']
```

> PS. 如果你想用空字符串作为分隔符的话,为什么不试试第一种写法呢？

## 非文本元素作为命令头

注: 该特性为`0.5.3`以上

`headers`可以传入消息元素, 所以以下是可以的:
```python
>>> test = Alconna(
...     headers=[At(12345)],
...     command="丢漂流瓶",
...     main_args=Args["content":AnyParam]
... )
>>> msg = MessageChain.create(At(12345), " 丢漂流瓶 ", "I L U")
>>> wild.analyse_message(msg).main_args
{'content': 'I L U'}
```