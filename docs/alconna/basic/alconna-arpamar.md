---
id: alconna-arpamar
title: 解析结果
---

## Arpamar

`Alconna` 会将解析的结果包装为一个`Arpamar`返回，你可以通过`Arpamar`获取解析成功的值

通过如下方式来使用`Arpamar`:

## 方法 
 
 | 方法名 | 参数 | 返回值 | 描述 |
 |:--------:|:--------:|:--------:|:--------:|
 | Arpamar.get | param-name: str | Dict or Any | 返回 Arpamar 中指定的属性 |
 | Arpamar.has | param-name: str | Bool | 判断 Arpamar 内是否有对应的属性 |
 
## 属性

 | 属性名 | 属性类型 | 描述 |
 |:--------:|:--------:|:--------:|
 | Arpamar.matched | bool | 返回命令是否匹配成功 |
 | Arpamar.error_data | List | 当匹配失败时，该参数为剩余未解析的参数 |
 | Arpamar.main_args | Dict or Any | 当 `Alconna` 写入了 `main_args` 时, 该参数返回对应的解析出来的值 |
 | Arpamar.header | str or bool | 当 `Alconna` 的 `command` 内写有正则表达式时,该参数返回对应的匹配值; 若未写, 返回命令头是否匹配成功 |
 | Arpamar.all_matched_args | Dict | 返回 `Alconna` 中所有 `Args` 解析到的值 |
 | Arpamar.option_args | Dict | 返回 `Alconna` 中所有 `Option` 与 `Subcommand` 里的 `Args` 解析到的值 |

另外, 可直接通过`Arpamar.xxx` 来获取 `xxx`参数
```python
>>> alc = Alconna(
...     command="test",
...     options=[
...         Option("name", Args["pak":str]),
...         Option("foo", Args["bar":bool:True])
...     ]
... )
>>> msg = MessageChain.create("test name ces foo False")
>>> result = alc.analyse_message(msg)
>>> result.pak
'ces'
>>> result.bat
False
```