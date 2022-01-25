---
id: special-construct
title: 多种构造方法
---

## 特殊的构造形式
如果你不想写一大串的代码, `Alconna` 目前提供了3种特殊的构造方式:
- koishi-like
- formatter 
- iterable

### Koishi-like
`Alconna` 的koishi-like形式的构造方法, 如
```python
Alconna.set_custom_types(digit=int)
alc = Alconna.from_string(
...     "[tt|test_type] <wild> <text:str> <num:digit> <boolean:bool:False>",
...     "--foo|-f [True]"
... )
```

它与如下是等效的:
```python
alc = Alconna(
    headers=["tt", "test_type"],
    options=[Option("--foo", alias='-f', actions=store_bool(True))]
    main_args=Args["wild":AnyParam, "text":str, "num":int, "boolean":bool:False]
)
```
`<xxx>`代表参数, 如`<value:int>`等价于`Args['value':int]`, `<message>`等价于`Args['message':AnyParam]`

:::caution 注意!

另外， `<...xxx>` 表示该处为 `AllParam`, 会截断之后的解析操作

:::

针对option的`[xxx]`代表`store_val(xxx)`的`action`

### Formatter
`Alconna` 的formatter形式的构造方法, 如
```python
alc = Alconna.format("lp user {0} perm set {1} {2}",[AnyStr, AnyStr, Args["value":Bool:True]])
```
或
```python
alc = Alconna.format("lp user {target} perm set {perm} {value}", {"target": AnyStr, "perm": AnyStr, "value": Args["value":Bool:True]})
```

它与如下是等效的:
```python
alc = Alconna(
    command="lp",
    options=[
        Option("user", target=AnyStr),
        Subcommand(
            "perm", 
            Option("set", perm=AnyStr), 
            Args["value":Bool:True]
        )
    ]
)
```