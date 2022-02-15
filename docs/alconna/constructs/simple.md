---
id: simple
title: 简易 方式
---

## 实例化

该方式十分简易, 只能构造含有主参数的命令:
```python
from arclet.alconna import Alconna
alc = Alconna.simple("test", ("foo", str), ("bar", int, 123))
```

它与如下是等效的:
```python
from arclet.alconna import Alconna, Args
alc = Alconna(
    command="test",
    main_args=Args["foo":str,, "bar":int:123]
)
```