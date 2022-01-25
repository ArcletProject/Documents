---
id: alconna-args
title: 命令参数
---

## Args

`Args` 是一个特殊的类，用来包装`command`中的`args`, 即命令参数, 如

```python
opt = Option("test", args=Args(foo=AnyStr, num=AnyDigit).default(foo="bar"))
```
或
```python
opt = Option("test", args=Args["foo":str:"bar", "num":int])
```

:::tip

在Args中, `AnyStr`与`str`是等价的, 其他类型同理

:::

`Args` 构造时需要格式为key-value的多个参数, 或传入多个slice对象

推荐使用Args相关的魔术方法，如
```python
>>> ar = Args["test":bool:"True"]["aaa":str:"bbb"] << Args["perm":AnyStr:"de"] + ["month", AnyDigit]
>>> ar["foo"] = ["bar", ...]
>>> ar
Args('test': '(True|False)' = 'True', 'aaa': '(.+)' = 'bbb', 'perm': '(.+)' = 'de', 'month': '(\d+)', 'foo': 'bar' = '<class 'inspect._empty'>')
>>> ar["foo"]
('bar', <class 'inspect._empty'>)
```

`Args.default()` 用来设置`key`对应的`value`的默认值，可以传入`alconna.types`下的`Empty` (实际为inspect._empty)

对于`int`,`bool`类的参数, `Alconna`解析成功后会把匹配出来的值(应该是str) 转回对应的类型 (如`'123'`变为`123`)

## AnyParam 与 AllParam

`AnyParam`与`AllParam`是特殊的两种参数类型, 作用分别为**单参**泛匹配与**全参**泛匹配

您可以在`alconna.types`里找到它们

对于同个命令, `/test foo bar 123` 来讲

```python
test1 = Alconna(
        command="/test",
        main_args=Args["wild":AnyParam],
    )
test2 = Alconna(
        command="/test",
        main_args=Args["wild":AllParam],
    )
```

`test1`只能将`foo`匹配给`wild`

而 `test2` 能够将`foo bar 123` 匹配给`wild`

:::caution

`AllParam`会直接截断后续的命令解析操作, 请谨慎使用

:::