---
slug: alconna-principle
title: Alconna Principle
authors:
  name: Tar Railt
  title: Creator of Arclet
  url: https://github.com/RF-Tar-Railt
  image_url: https://github.com/RF-Tar-Railt.png
tags: [Alconna]
---

## 起点

Alconna 的强大很大一部分在于 Args 和 BasePattern, 其完成了 Alconna 的类型系统

### BasePattern

BasePattern 依据其 `Mode` 选择对应的验证方式, 并且利用 `accepts`, `previous` ,`validator` 完成了不同阶段的验证

这就使得 BasePattern 能够完成相对复杂的类型验证任务, 并且拥有 TypeGuard 的特性

UnionArg, MultiArg, SeqArg, MapArg 则是 BasePattern的不同子类

除去 MultiArg 涉及到对多个参数的验证需要解析器的参与, 剩余几个仅修改了`init`和`match`

其中 UnionArg 含有 `for_equal` 与 `for_validate`, 运行验证同一类型的参数或同一内容的参数

### Args

Args 负责的是将复数个 `name: type|value: default` 转变为 `name: pattern: default: flag`

flag 可以增加额外信息以提示高层解析器该参数的解析行为

另外, args_type_parser 负责将 type|value 转变为 pattern, 其完成了部分`typing`支持, 并使得 Args 可以弄一些类型体操

```python
def query(name: str):
  if not database.select(...).where(...):
    raise ValueError
  ...

a = Args["name", query]["mode", {"foo": 0, "bar": 1, "baz": 2, "qux": 3}]
```

## 核心

Alconna 的核心部件是 `arclet.alconna.analysis` 内的 `parts` 与 `analyser`, 负责的功能有
预编译、 参数提取 与 解析调度

### "预编译"

预编译是在 解析器初始化时完成的。 Analyser 上繁多的属性有很大一部分是负责记录预编译的信息

这些包括有: 头部匹配内容, 名称-组件映射, 名称-行为映射, 通过解析传入的 Alconna 对象.

预编译完成后, Alconna 发生任何改动都需要重新生成一遍 Analyser (通过 CommandManager)

:::info

`Alconna.parse()` 包括一个 `static: bool = True` 参数, 其为 False 时将一直运行时创建 Analyser
(类似 pat = re.compile, pat.match 和 re.match)

:::

### 参数提取

消息从parse传入后, 首先交给 Analyser的process方法, 其负责将以 `DataCollection` 协议约束的数据源转换为
`List[Any, StrMounter]` 类型的集合.

Analyser 规定传入的数据中若存在字符串或能提取为字符串的数据, 则对其进行分隔并用`StrMounter`包装
(只是个 List 的子类, 以与传入的 List类型数据区分).

即传入`["hello world!", 123, True, "foo bar baz qux"]` 时, 处理出来的数据不是

```python
data = [
  "hello", 
  "world!", 
  123, 
  True, 
  "foo", 
  "bar", 
  "baz", 
  "qux"
]
```
而是
```python
data = [
  ["hello", "world!"],
  123,
  True,
  ["foo", "bar", "baz", "qux"]
]
```

Analyser 最核心的要点之一, 数据调度便依据这种二维结构进行.

数据调度依靠 Analyser 的两个属性: `current_index` 和 `content_index`, 作为数据集合的 `指针` 

在 Analyser 的 next_data 方法中(或称 pull), Analyser 首先判定 `current_index` 是否到达边界, 
然后 `current_index` 先取出第一层数据, 若该数据不是 StrMounter 类型则直接 current++, 并返回数据;
否则, content++ 并返回指向的字符串

reduce_data 方法(或称 pushback) 则相反, 先对放回的数据进行有效判断, 再依据指针当前位置的数据类型与放回的数据类型对指针进行相应移动.

整个过程, 除开因子域分隔符需要对字符串进行替换消除外, 不涉及到数据集合的空间改变.

### 解析调度

消息处理完毕后, Analyser 会首先尝试匹配头部内容, 这部分由 analyse_header 完成.

Alconna 的 headers 有较为复杂的编写方式, 这些被统一归为两类: for_match 和 for_equal

analyse_header 会依据预编译后headers的分类来选择如何获取数据.

另外, 当匹配失败后, analyse_header会尝试进行模糊匹配

若头部匹配成功, 则 Analyser 开始进行对组件内容的匹配.

这部分会调动 analyse_args, analyse_option, analyse_subcommand 和 analyse_unmatched_param

预编译时期, 所有的可用字段都会被加入到 command_params 中, 这些包括 option 的 aliases 和 node 的 requires

Analyser 首先会对 next_data 返回的数据判断是否为字符串, 若不是字符串则默认进入主参数的解析

若字符串不在 command_params 中, 则说明这个参数 1. 是因为组件自定义了分隔符 2. 是主参数 ,则进入 analyse_unmatched_param

:::tip

这里需要说明 主域分隔符和子域分隔符问题, 主域分隔符是在 Alconna 构建时定义的, 其负责了处理消息时对字符串的切割.

也就是说, 你无法实现 Option的 name 传入如 "FOO(main_sep)BAR" 一样的名字. 这个问题后交由 requires 实现.

而子域分隔符是定义在 Option 或 Args 的分隔符. 若三者都定义了各自的分隔符, 画风应该是这样:
```
COMMAND MAIN_SEP OPTION1 OPT_SEP ARG1 ARG_SEP ARG2 MAIN_SEP OPTION2 ...
```

一般而言, 主域与子域的分隔符都默认为空格, 但显然 Alconna 不止步于此.

:::

analyse_unmatched_param 会尝试前缀匹配, 若有组件成功匹配则返回组件, 否则返回传入的参数. 另外, analyse_unmatched_param
也会尝试进行模糊匹配.

在这之后, 依据获取的数据, Analyser会调度各部件解析方法, 并尝试捕获部件解析方法因解析失败而抛出的异常.

#### requires

Option 与 Subcommand 都包括有特殊的 requires 参数, 以应对需要"FOO(SEP)BAR"的情况, 也是为了解决[命令深度的问题](https://github.com/ArcletProject/Alconna/discussions/44)

在预编译时期, Analyser会提取 requires 并构造为 `Sentence` 放入 command_params 中

解析时, 若字段匹配为Sentence, 则该字段会被推入 Analyser 的临时 sentence 列表中

而当解析进入 Option 或 Subcommand 时, 若其存在 requires 参数, 则会判断当前 sentence 是否与自身的 requires 符合

该项实现同时也带动了 Option 的重载处理 (Subcommand 原则上不允许重载)



