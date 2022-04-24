---
id: tutorial
title: Alconna 导语
---

## 介绍

> 亚尔康娜 (Alconna), 是 凯丝洛伊 的"好"妹妹

[`Alconna`](https://github.com/ArcletProject/Alconna) 是 `Arclet Project` 下的命令解析器

`Alconna` 由繁多的预设组件来架构其解析功能, 以用于更加精确的命令解析.

```python
from arclet.alconna import Alconna

v = Alconna("获取{name}的涩图", headers=["!", ".bot"])
print(v.parse("!获取円香的涩图").header)

"{'name': '円香'}"
```

## 安装
pip
```
pip install --upgrade arclet-alconna
```

## 特点

- `Alconna` 既能解析纯文本, 也能解析如 `MessageChain` 的复杂数据, 或 `List[str]`等原始数据

- `Alconna` 拥有强大的类型转换与繁多的类型预设, 可以自定义类型, 并且可以自定义类型的解析方式

- `Alconna` 提供了简单的构造方法, 无需调整过多参数便可使用; 可以解析字符串与消息链

- `Alconna` 会将解析的结果包装成 `Arpamar`, 你可以通过 `Arpamar` 获取传入的消息内容

- `Alconna` 可以自定义解析器, 可以自定义解析器的解析方式, 可以自定义解析器的解析结果

- `Alconna` 集成了模糊匹配、自定义语言文件等功能

## 性能参考
在 i5-10210U 处理器上, `Alconna` 的性能大约为 `36000~71000 msg/s`, 取决于 `Alconna` 的复杂程度