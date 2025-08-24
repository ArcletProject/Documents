---
prev: 服务器插件
next: Tarina
---

# 数据库插件

`entari-plugin-database` 属于官方插件，允许你在插件中使用数据库进行数据存储和查询。

由于基于 [`SQLAlchemy`](https://www.sqlalchemy.org/)，大部分情况下，你可以直接使用 SQLAlchemy 的 API 来操作数据库。

本插件只提供了 ORM 功能，没有数据库后端，也没有直接连接数据库后端的能力。 所以你需要另行安装数据库驱动和数据库后端，并且配置数据库连接信息。

## 安装

::: code-group
```bash:no-line-numbers [pdm]
pdm add entari-plugin-database
```

```bash:no-line-numbers [uv]
uv add entari-plugin-database
```

```bash:no-line-numbers [pip]
pip install entari-plugin-database
```
:::

## 配置连接
在配置文件中，你可以通过 `database` 字段来配置数据库连接:

```yaml:no-line-numbers title=entari.yml
basic:
  log:
    ignores: ["aiosqlite.core"]  # 忽略 aiosqlite 的 DEBUG 日志
plugins:
  database:
    type: sqlite  # 数据库类型, 可选值有 sqlite, mysql, postgresql, oracle 等
    name: my_database.db  # 数据库名称或文件目录
    driver: aiosqlite  # 数据库驱动, 根据数据库类型选择
    ...
```

`type` 与 `driver` 的支持列表详见 [Dialects](https://docs.sqlalchemy.org/en/21/dialects/#included-dialects)。

其余的配置项包括:
- `host`: 数据库主机地址 (仅在使用 MySQL/PostgreSQL 等远程数据库时需要)
- `port`: 数据库端口号 (仅在使用 MySQL/PostgreSQL 等远程数据库时需要)
- `username`: 数据库用户名 (仅在使用 MySQL/PostgreSQL 等远程数据库时需要)
- `password`: 数据库密码 (仅在使用 MySQL/PostgreSQL 等远程数据库时需要)
- `query`: 数据库连接参数 (仅在使用 MySQL/PostgreSQL 等远程数据库时需要)
- `options`: 数据库连接其他选项。参见 [Engine Creation API](https://docs.sqlalchemy.org/en/21/core/engines.html#engine-creation-api)
- `session_options`: 会话选项。参见 [Session](https://docs.sqlalchemy.org/en/21/orm/session_api.html#sqlalchemy.orm.Session.__init__)
- `binds`: 绑定多个数据库配置，用于为不同插件下的ORM模型指定不同的数据库连接。
    ```yaml:no-line-numbers title=entari.yml
    plugins:
      database:
        type: sqlite
        name: main.db
        binds:
          entari_plugin_record:  # 为 entari_plugin_record 插件下的模型指定单独的数据库连接
            type: postgresql
            host: localhost
            port: 5432
            username: user
            password: pass
    ```
- `create_table_at`: 指定在数据库服务的哪个生命周期阶段创建表。可选值有 `preparing`, `prepared` 和 `blocking`.

- 若不传入配置项，则默认使用 SQLite 数据库，并将数据库文件存储在当前目录下。

## 定义模型

`database` 插件使用 SQLAlchemy 的 ORM 功能来定义模型。你可以通过继承 `database.Base` 类来定义你的模型类。

假设我们要定义一个存储天气信息的模型：

```python title=my_plugin.py
from entari_plugin_database import Base, Mapped, mapped_column

class Weather(Base):
    location: Mapped[str] = mapped_column(primary_key=True)
    weather: Mapped[str]
```

其中，`primary_key=True` 意味着此列 (location) 是主键，即内容是唯一的且非空的。 每一个模型必须有至少一个主键。

我们可以用以下代码检查模型生成的数据库模式是否正确：

```python
from sqlalchemy.schema import CreateTable

print(CreateTable(Weather.__table__))
```

```sql
CREATE TABLE my_plugin_weather (
    location VARCHAR NOT NULL,
    weather VARCHAR NOT NULL,
    CONSTRAINT pk_my_plugin_weather PRIMARY KEY (location)
)
```

可以注意到表名是 `my_plugin_weather` 而不是 `Weather` 或者 `weather`。 这是因为数据库插件会自动为模型生成一个表名，规则是：`<插件模块名>_<类名小写>`。

你也可以通过指定 `__tablename__` 属性，或传入关键字来自定义表名：

:::code-group

```python title=my_plugin.py [指定 __tablename__]
from entari_plugin_database import Base, Mapped, mapped_column

class Weather(Base):
    __tablename__ = "custom_weather"  # 自定义表名
    location: Mapped[str] = mapped_column(primary_key=True)
    weather: Mapped[str]
```

```python title=my_plugin.py [传入关键字]
from entari_plugin_database import Base, Mapped, mapped_column

class Weather(Base, tablename="custom_weather"):  # 自定义表名
    location: Mapped[str] = mapped_column(primary_key=True)
    weather: Mapped[str]
```
:::


## 使用会话

在 `SQLAlchemy` 中，操作数据库需要通过会话 (Session) 来进行。 关于如何通过会话使用 SQLAlchemy 的 ORM 功能，你可以参考 [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/en/21/orm/quickstart.html)。

`database` 插件通过 `SqlalchemyService` 提供数据库会话服务。 你可以通过依赖注入的方式获取 `SqlalchemyService` 实例，并使用它来获取数据库会话。

:::code-group

```python title=my_plugin.py [ORM]
from arclet.entari import command
from entari_plugin_database import SqlalchemyService, select

@command.on("get_weather {location}")
async def on_message(location: str, db: SqlalchemyService):
    async with db.get_session() as db_session:
        # 在这里使用 SQLAlchemy 的会话进行数据库操作
        result = await db_session.scalars(select(Weather).where(Weather.location == location))
        data = result.all()
        return f"Data: {data}"
```

```python title=my_plugin.py [SQL语句]
from arclet.entari import command
from entari_plugin_database import SqlalchemyService
from sqlalchemy import text

@command.on("get_weather {location}")
async def on_message(location: str, db: SqlalchemyService):
    async with db.get_session() as db_session:
        # 在这里使用 SQLAlchemy 的会话进行数据库操作
        result = await db_session.execute(text("SELECT * FROM weather WHERE location=:location"), {"location": location})
        data = result.fetchall()
        return f"Data: {data}"
```

:::


又或者，你也可以通过直接依赖注入 `AsyncSession` 来获取数据库会话：

```python title=my_plugin.py
from arclet.entari import command
from entari_plugin_database import AsyncSession, select

@command.on("get_weather {location}")
async def on_message(location: str, db_session: AsyncSession):
    # 在这里使用 SQLAlchemy 的会话进行数据库操作
    result = await db_session.scalars(select(Weather).where(Weather.location == location))
    data = result.all()
    return f"Data: {data}"
```

直接依赖注入 `AsyncSession` 时，获取到的会话已经是一个上下文管理器，你不需要再使用 `async with` 来管理它。

:::info

`AsyncSession` 的生命周期与单个订阅者同步，即每次命令或事件触发时，每个订阅者都会创建一个新的 `AsyncSession` 实例，并在处理完成后关闭它。

:::

## 依赖注入

在上面的示例中，我们都是通过会话获得数据的。 不过，我们也可以通过依赖注入获得数据：

```python title=my_plugin.py {6-8}
from arclet.entari import Param, command
from entari_plugin_database import SQLDepends, select

@command.command("get_weather <location:str>")
async def on_message(
    weather: Weather = SQLDepends(
        select(Weather).where(Weather.location == Param("location"))
    ),
):
    return f"Data: {weather}"
```

其中，SQLDepends 是一个特殊的依赖注入，它会根据类型标注和 SQL 语句提供数据，SQL 语句中也可以有子依赖。
但不建议使用 `select` 以外的语句，因为语句可能没有返回值（`returning` 除外），而且代码不清晰。

不同的类型标注也会获得不同形式的数据：

```python title=my_plugin.py {1,7-9}
from collections.abc import Sequence
from arclet.entari import Param, command
from entari_plugin_database import SQLDepends, select

@command.command("get_weather <location:str>")
async def on_message(
    weathers: Sequence[Weather] = SQLDepends(
        select(Weather).where(Weather.location == Param("location"))
    ),
):
    return "Data\n" + "\n".join(f"- {weather}" for weather in weathers)
```

:::tip

`Param` 也是一类 `Depends`, 等同于 `Depends(lambda <name>: <name>)` 或 `Depends(lambda ctx: ctx[<name>])`。

:::

类型标注将决定依赖注入的实际的数据结构，主要影响以下几个层面：
- 迭代器（`session.execute()`）或异步迭代器（`session.stream()`）
- 标量（`session.execute().scalars()`）或元组（`session.execute()`）
- 单个（`session.execute().one_or_none()`）或全部（`session.execute() / session.execute().all()`）
- 连续（`session().execute()`）或分块（`session.execute().partitions()`）

具体而言：

:::code-group

```python:no-line-numbers [Iterator]
async def _(rows_partitions: AsyncIterator[Sequence[tuple[Model, ...]]]):
    # 等价于 rows_partitions = await (await session.stream(sql).partitions())

    async for partition in rows_partitions:
        for row in partition:
            print(row[0], row[1], ...)

async def _(row_partitions: Iterator[Sequence[tuple[Model, ...]]]):
    # 等价于 row_partitions = await session.execute(sql).partitions()

    for partition in rows_partitions:
        for row in partition:
            print(row[0], row[1], ...)

async def _(model_partitions: AsyncIterator[Sequence[Model]]):
    # 等价于 model_partitions = await (await session.stream(sql).scalars().partitions())

    async for partition in model_partitions:
        for model in partition:
            print(model)

async def _(model_partitions: Iterator[Sequence[Model]]):
    # 等价于 model_partitions = await (await session.execute(sql).scalars().partitions())

    for partition in model_partitions:
        for model in partition:
            print(model)
```

```python:no-line-numbers [Result/ScalarResult]
async def _(rows: sa_async.AsyncResult[tuple[Model, ...]]):
    # 等价于 rows = await session.stream(sql)

    async for row in rows:
        print(row[0], row[1], ...)

async def _(rows: sa.Result[tuple[Model, ...]]):
    # 等价于 rows = await session.execute(sql)

    for row in rows:
        print(row[0], row[1], ...)

async def _(models: sa_async.AsyncScalarResult[Model]):
    # 等价于 models = await session.stream(sql).scalars()

    async for model in models:
        print(model)

async def _(models: sa.ScalarResult[Model]):
    # 等价于 models = await session.execute(sql).scalars()

    for model in models:
        print(model)
```

```python:no-line-numbers [Sequence]
async def _(rows: Sequence[tuple[Model, ...]]):
    # 等价于 rows = await (await session.stream(sql).all())

    for row in rows:
        print(row[0], row[1], ...)

async def _(models: Sequence[Model]):
    # 等价于 models = await (await session.stream(sql).scalars().all())

    for model in models:
        print(model)
```

```python:no-line-numbers [Model/tuple[Model, ...]]
async def _(row: tuple[Model, ...]):
    # 等价于 row = await (await session.stream(sql).one_or_none())

    if row:
        print(row[0], row[1], ...)

async def _(model: Model | None):
    # 等价于 model = await (await session.stream(sql).scalars().one_or_none())
    if model:
        print(model)
```
:::
