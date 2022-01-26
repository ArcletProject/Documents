---
id: tutorial
title: Alconna 介绍
---

## Introduction

[`Alconna`](https://github.com/ArcletProject/Alconna) 是 `Arclet` 下的命令解析器

- `Alconna` 可以通过单个对象去解析多种命令

- `Alconna` 提供了简单的构造方法, 无需调整过多参数便可使用; 可以解析字符串与消息链

- `Alconna` 会将解析的结果包装成 `Arpamar`, 你可以通过 `Arpamar` 获取传入的消息内容

```python
>>> from arclet.alconna import *
>>> v = Alconna(headers=["!", ".bot"], command=f"获取{AnyStr}的涩图")
>>> v.analyse_message("!获取円香的涩图").header
'円香'
```

## 安装
pip
```
pip install --upgrade arclet-alconna
```

## 性能参考
在 i5-10210U 处理器上, `Alconna` 的性能大约为 `36000~71000 msg/s`, 取决于 `Alconna` 的复杂程度