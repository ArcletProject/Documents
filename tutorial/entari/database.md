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
- `options`: SQLAlchemy 的其他选项。参见 [Engine Creation API](https://docs.sqlalchemy.org/en/21/core/engines.html#engine-creation-api)

若不传入配置项，则默认使用 SQLite 数据库，并将数据库文件存储在当前目录下。

## 定义模型

`database` 插件使用 SQLAlchemy 的 ORM 功能来定义模型。你可以通过继承 `database.Base` 类来定义你的模型类。

```python title=my_plugin.py
from entari_plugin_database import Base, Mapped, mapped_column

class Weather(Base):
    __tablename__ = "weather"
    
    location: Mapped[str] = mapped_column(primary_key=True)
    weather: Mapped[str]
```

我们可以用以下代码检查模型生成的数据库模式是否正确：

```python
from sqlalchemy.schema import CreateTable

print(CreateTable(Weather.__table__))
```

```sql
CREATE TABLE weather (
    location VARCHAR NOT NULL,
    weather VARCHAR NOT NULL,
    CONSTRAINT pk_weather PRIMARY KEY (location)
)
```


## 使用会话

`database` 插件通过 `SqlalchemyService` 提供数据库会话服务。

你可以通过依赖注入的方式获取 `SqlalchemyService` 实例，并使用它来获取数据库会话。

:::code-group

```python title=my_plugin.py [ORM]
from arclet.entari import Session, command
from entari_plugin_database import SqlalchemyService
from sqlalchemy import select

@command.on("get_weather {location}")
async def on_message(location: str, session: Session, db: SqlalchemyService):
    async with db.get_session() as db_session:
        # 在这里使用 SQLAlchemy 的会话进行数据库操作
        result = await db_session.scalars(select(Weather).where(Weather.location == location))
        data = result.all()
        await session.send(f"Data: {data}")
```


```python title=my_plugin.py [SQL语句]
from arclet.entari import Session, command
from entari_plugin_database import SqlalchemyService
from sqlalchemy import text

@command.on("get_weather {location}")
async def on_message(location: str, session: Session, db: SqlalchemyService):
    async with db.get_session() as db_session:
        # 在这里使用 SQLAlchemy 的会话进行数据库操作
        result = await db_session.execute(text("SELECT * FROM weather WHERE location=:location"), {"location": location})
        data = result.fetchall()
        await session.send(f"Data: {data}")
```

:::

关于如何使用 SQLAlchemy 的 ORM 功能，你可以参考 [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/en/21/orm/quickstart.html)。
