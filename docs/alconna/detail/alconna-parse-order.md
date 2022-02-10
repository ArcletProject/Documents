---
id: parse-order
title: 解析顺序
---

## 无序解析

一般情况下, `Alconna`是默认以 **无序方式** 解析命令的

**无序** 是指, `Alconna`内各个命令单元的先后顺序不影响解析时的使用顺序

比如`A | B | C`, 传入的命令为`cmdB| cmdA | cmdC`, 那么解析时`B`解析的部分一定是`cmdB`

即`pip install alconna --upgrade` 与 `pip install --upgrade alconna`都是可以解析成功的

## 有序解析

:::note 注意

此为 0.5.8 新特性, 并且不保证为最终版本

:::

**有序** 解析，即与无序解析相反, 各个命令单元的先后顺序决定了解析时的使用顺序

可在构造`Alconna`时
```python
from arclet.alconna import Alconna
Alconna(..., order_parse=True)
```
选择有序解析

有序解析固定了解析顺序为`command headers` -> `main_args` -> `options`

## 缓存

:::note 注意

此为 0.5.8 新特性, 并且不保证为最终版本

:::

为了提升解析效率, 我们在新版本中加入了缓存(cache)机制

该机制仅在选择了**有序解析**时开启

顾名思义, 缓存会将某类命令的第一次解析结果进行分析, 并保存匹配节点

当同类命令再次出现时, `Alconna`将跳过解析部分, 直接根据匹配节点获取可能的数据并返回

```pycon
# 首次解析
matched=True head_matched=True error_data=[] _options={'foo': {'bar': At(target=123)}} _other_args={'bar': At(target=123)} _main_args={}
# 缓存机制生效
matched=True head_matched=False error_data=[] _options={} _other_args={'bar': At(target=123)} _main_args={}
```

:::caution

该功能并未进行充足验证，请谨慎使用

:::
