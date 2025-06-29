---
prev: Entari
---

# Tarina

[`Letoderea`](https://github.com/ArcletProject/Tarina) 是 `Arclet Project` 下的一个组件与开发工具集合, 旨在为其他项目提供一些通用功能，便利开发者的工作。


## i18n

Tarina 提供了一个简单的国际化（i18n）解决方案，支持多语言条目管理和模板字符串。其主要代码位于 [`tarina.lang`]((https://github.com/ArcletProject/Tarina/tree/main/src/tarina/lang)

`tarina.lang`提供了一个 tarina-lang 命令行工具。 首先可以通过 `tarina-lang new` 创建文件夹 `i18n`，

之后执行 `cd ./i18n` 和 `tarina-lang init` 指令，会生成如下文件：
```txt:no-line-numbers
📦 project
├──📂 i18n
│   ├── __init__.py // [!code ++]
│   ├── .config.json // [!code ++]
│   ├── .template.json // [!code ++]
│   └── .template.schema.json // [!code ++]
├── xxx.py
└── ...
```

你需要将你语言文件中所有包含的项目声明在 `.template.json` 中，例如：

```json title=.template.json
{
  "$schema": ".template.schema.json",
  "scopes" : [
    {
      "scope": "example",
      "types": [
        "test",
        {
          "subtype": "test1",
          "types": [
            "test2"
          ]
        }
      ]
    }
  ]
}
```

然后通过 `tarina-lang schema` 和 `tarina-lang create XXX` 指令来创建新的语言文件。以下为使用命令创建 `en-US` 和 `zh-CN` 语言文件后的文件结构：
```txt:no-line-numbers
📦 project
├──📂 i18n
│   ├── __init__.py
│   ├── .config.json
│   ├── .lang.schema.json // [!code ++]
│   ├── .template.json
│   ├── .template.schema.json
│   ├── en-US.json // [!code ++]
│   └── zh-CN.json // [!code ++]
├── xxx.py
└── ...
```

其中一个语言文件如下所示：

```json title=en-US.json
{
  "$schema": "./.lang.schema.json",
  "example": {
    "test": "Test",
    "test1": {
      "test2": "Test2"
    }
  }
}
```

> [!NOTE]
> `tarina-lang` 支持创建和读取 YAML 格式的语言文件。当然首先你需要额外安装 `tarina[yaml]`
> 
> 然后通过 `tarina-lang create XXX --yaml` 指令创建 `.yml` 文件
>
> 一个 yaml 格式的语言文件如下所示：
> ```yaml:no-line-numbers title=en-US.yml
> # $schema: .lang.schema.json
> example:
>   test: Test
>   test1:
>     test2: Test2
> ```

之后，在 `xxx.py` 里面，你可以用如下方法来使用i18n条目：

```python title=xxx.py
from .i18n import lang

...
text1 = lang.require("example", "test")  # Test
# 如果你的条目是模板字符串，你应该直接 text = text.format(...)
text2 = lang.require("example", "test1.test2")  # Test2
```

高级一点，你可以通过 `tarina-lang model` 指令来生成一个模型文件：

```txt:no-line-numbers
📦 project
├──📂 i18n
│   ├── __init__.py
│   ├── .config.json
│   ├── .template.json
│   ├── .template.schema.json
│   ├── en-US.json
│   ├── model.py  // [!code ++]
│   └── zh-CN.json
├── xxx.py
└── ...
```

其中 `model.py`:

```python title=model.py
from tarina.lang.model import LangItem, LangModel

class ExampleTest1:
    test2: LangItem = LangItem("example", "test1.test2")

class Example:
    test: LangItem = LangItem("example", "test")
    test1: ExampleTest1

class Lang(LangModel):
    example = Example

```

之后便可以这样使用：

```python title=xxx.py
from .i18n import Lang
...
text1 = Lang.example.test()  # Test
# 如果你的条目是模板字符串，你可以使用 text = Lang.example.test(...)
text2 = Lang.example.test1.test2()  # Test2
```
