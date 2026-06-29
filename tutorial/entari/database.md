---
prev: 服务器插件
next: 权限插件
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

假设我们要定义一个存储调用插件记录的模型：

```python title=my_plugin.py
from entari_plugin_database import Base, Mapped, mapped_column

class Record(Base):
    plg_name: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[int]
    user_name: Mapped[str]
```

其中，`primary_key=True` 意味着此列 (plg_name) 是主键，即内容是唯一的且非空的。 每一个模型必须有至少一个主键。

我们可以用以下代码检查模型生成的数据库模式是否正确：

```python
from sqlalchemy.schema import CreateTable

print(CreateTable(Record.__table__))
```

```sql
CREATE TABLE my_plugin_record (
    plg_name VARCHAR NOT NULL,
    user_id INTEGER NOT NULL,
    user_name VARCHAR NOT NULL,
    CONSTRAINT pk_my_plugin_record PRIMARY KEY (plg_name)
)
```

可以注意到表名是 `my_plugin_record` 而不是 `Record` 或者 `record`。 这是因为数据库插件会自动为模型生成一个表名，规则是：`<插件模块名>_<类名小写>`。

你也可以通过指定 `__tablename__` 属性，或传入关键字来自定义表名：

:::code-group

```python title=my_plugin.py [指定 __tablename__]
from entari_plugin_database import Base, Mapped, mapped_column

class Record(Base):
    __tablename__ = "record"  # 自定义表名
    plg_name: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[int]
    user_name: Mapped[str]
```

```python title=my_plugin.py [传入关键字]
from entari_plugin_database import Base, Mapped, mapped_column

class Record(Base, tablename="record"):  # 自定义表名
    plg_name: Mapped[str] = mapped_column(primary_key=True)
    user_id: Mapped[int]
    user_name: Mapped[str]
```
:::


## 使用会话

在 `SQLAlchemy` 中，操作数据库需要通过会话 (Session) 来进行。 关于如何通过会话使用 SQLAlchemy 的 ORM 功能，你可以参考 [SQLAlchemy 官方文档](https://docs.sqlalchemy.org/en/21/orm/quickstart.html)。

`database` 插件通过 `SqlalchemyService` 提供数据库会话服务。 你可以通过依赖注入的方式获取 `SqlalchemyService` 实例，并使用它来获取数据库会话。

:::code-group

```python title=my_plugin.py [ORM]
from arclet.entari import command
from entari_plugin_database import SqlalchemyService, select

@command.on("check {name}")
async def on_message(name: str, db: SqlalchemyService):
    async with db.get_session() as db_session:
        # 在这里使用 SQLAlchemy 的会话进行数据库操作
        result = await db_session.scalars(select(Record).where(Record.plg_name == name))
        data = result.all()
        return f"Data: {data}"
```

```python title=my_plugin.py [SQL语句]
from arclet.entari import command
from entari_plugin_database import SqlalchemyService
from sqlalchemy import text

@command.on("check {name}")
async def on_message(name: str, db: SqlalchemyService):
    async with db.get_session() as db_session:
        # 在这里使用 SQLAlchemy 的会话进行数据库操作
        result = await db_session.execute(text("SELECT * FROM my_plugin_record WHERE plg_name=:name"), {"name": name})
        data = result.fetchall()
        return f"Data: {data}"
```

:::


又或者，你也可以通过直接依赖注入 `AsyncSession` 来获取数据库会话：

```python title=my_plugin.py
from arclet.entari import command
from entari_plugin_database import AsyncSession, select

@command.on("check {name}")
async def on_message(name: str, db_session: AsyncSession):
    # 在这里使用 SQLAlchemy 的会话进行数据库操作
    result = await db_session.scalars(select(Record).where(Record.plg_name == name))
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

@command.command("check <name:str>")
async def on_message(
    record: Record = SQLDepends(
        select(Record).where(Record.plg_name == Param("name"))
    ),
):
    return f"Data: {record}"
```

其中，SQLDepends 是一个特殊的依赖注入，它会根据类型标注和 SQL 语句提供数据，SQL 语句中也可以有子依赖。
但不建议使用 `select` 以外的语句，因为语句可能没有返回值（`returning` 除外），而且代码不清晰。

不同的类型标注也会获得不同形式的数据：

```python title=my_plugin.py {1,7-9}
from collections.abc import Sequence
from arclet.entari import Param, command
from entari_plugin_database import SQLDepends, select

@command.command("check <name:str>")
async def on_message(
    records: Sequence[Record] = SQLDepends(
        select(Record).where(Record.plg_name == Param("name"))
    ),
):
    return "Data\n" + "\n".join(f"- {rec}" for rec in records)
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

## 数据库迁移

`entari-plugin-database` 内置了基于 [Alembic](https://alembic.sqlalchemy.org/) 的自动迁移系统。当 ORM 模型结构发生变更时，插件会自动检测差异并执行迁移，无需手动编写迁移脚本。

### 自动迁移机制

迁移在模型类定义完成后自动触发。插件的 `migration_callback` 会收集所有继承自 `Base` 的子类，按模块分组，依次进行迁移。

**工作流程：**

```text
模型定义完成 → 等待服务进入 blocking 阶段 → 加载迁移状态
→ 按模块分组分析模型 → 生成迁移计划 → 执行迁移 → 更新状态
```

#### Revision 计算

每个模型的 `revision` 由其表结构的规范 JSON 表示的 **MD5 哈希值** 决定。以下因素的变化会影响 revision：

- 列名、列类型、可空性
- 主键、外键
- 索引和约束
- 默认值、`server_default`

如果哈希值发生变化且与迁移状态记录不一致，插件会触发结构迁移。

你也可以通过设置 `__revision__` 属性来手动控制 revision：

```python
class Record(Base):
    __revision__ = "v2"  # 手动指定 revision
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
```

#### 迁移状态文件

迁移记录存储在用户目录下：

```text
~/.entari/data/database/migrations_lock.json
```

该文件使用 JSON 格式记录每个表的 revision 历史、所属模块和自定义脚本版本。每次迁移步骤成功后都会原子性地更新此文件，确保崩溃恢复安全。

```json
{
  "my_plugin_record": {
    "model_revision_history": [
      "98c3d2999538f87c8d7c6eac8418514c",
      "33463c3c37ae3e595e34b094a29bd996"
    ],
    "module": "my_plugin",
    "name": "Record",
    "revision": "33463c3c37ae3e595e34b094a29bd996"
  }
}
```

### 支持的操作

自动迁移支持以下结构变更：

| 操作 | 说明 |
|------|------|
| 添加列 | `AddColumnOp` — 新增字段 |
| 删除列 | `DropColumnOp` — 移除字段 |
| 修改列类型 | `AlterColumnOp` — 变更字段类型 |
| 添加约束 | `AddConstraintOp` — 新增主键/外键/唯一约束 |
| 删除约束 | `DropConstraintOp` — 移除约束 |
| 创建索引 | `CreateIndexOp` — 新增索引 |
| 变更默认值 | `AlterColumnOp` — 修改 `server_default` |

### SQLite 特殊处理

SQLite 对 `ALTER TABLE` 的支持有限，不支持直接删除列或修改约束。迁移系统会自动检测 SQLite 方言，并采用 **Batch 模式**：

当检测到需要 `DropColumnOp`、`AlterColumnOp`、`AddConstraintOp` 等操作时，会使用 Alembic 的 `batch_alter_table` 重新创建表，将数据迁移到新表后删除旧表。

:::warning
SQLite 的 Batch 模式可能在大型表上消耗较多时间和存储空间（重建整表），生产环境中请提前规划。
:::

### 多数据库迁移

如果配置了多个数据库连接（通过 `binds` 和模型的 `__bind_key__`），迁移系统会按引擎分组，分别在对应的数据库上执行迁移操作：

```python
class User(Base):
    __bind_key__ = "user_db"  # 指定使用 user_db 数据库
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
```

### 表重命名检测

当模型被重命名时，迁移系统会通过 `(模块名, 类名)` 作为键检测表重命名操作，执行 `ALTER TABLE RENAME` 而非删除重建。

### 废弃表清理

当模型的 ORM 类被移除后，迁移系统会检测到数据库中对应的表已不再有模型定义，自动执行 `DROP TABLE`。

### 自定义迁移脚本

对于无法通过自动结构迁移完成的操作（如数据迁移、复杂索引变更等），可以使用 `register_custom_migration` 装饰器注册自定义迁移脚本。

#### 注册升级脚本

```python
from entari_plugin_database import register_custom_migration, Base, Mapped, mapped_column

class Record(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

@register_custom_migration(Record, "upgrade", script_id="add_index", script_rev="1")
def upgrade(ops, mc, table):
    """为 name 字段添加索引"""
    ops.create_index("idx_record_name", table, ["name"])
```

#### 注册降级脚本

```python
@register_custom_migration(Record, "downgrade", script_id="add_index", script_rev="1")
def downgrade(ops, mc, table):
    """移除索引"""
    ops.drop_index("idx_record_name", table)
```

#### 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model_or_table` | `str \| type[Base]` | — | 目标 ORM 模型类或表名 |
| `action_type` | `"upgrade" \| "downgrade"` | `"upgrade"` | 脚本类型 |
| `script_id` | `str \| None` | 函数名 | 脚本标识，升级与降级需使用相同 ID |
| `script_rev` | `str` | `"1"` | 脚本版本，变化会触发重新执行 |
| `replace` | `bool` | `True` | 若为 `True`，跳过该表的自动结构迁移 |
| `run_always` | `bool` | `False` | 若为 `True`，每次启动都执行 upgrade |

#### 脚本函数签名

自定义脚本接收三个参数：

- `ops: Operations` — Alembic 操作对象，用于执行 DDL 操作
- `mc: MigrationContext` — Alembic 迁移上下文
- `table: str` — 当前操作的表名

示例 —— 使用 `replace=True` 完全接管表的管理：

```python
@register_custom_migration(Record, "upgrade", script_id="full_control", script_rev="2", replace=True)
def full_upgrade(ops, mc, table):
    ops.create_table(
        table,
        ops.Column("id", sa.Integer, primary_key=True),
        ops.Column("name", sa.String, nullable=False),
        ops.Column("email", sa.String),
    )

@register_custom_migration(Record, "downgrade", script_id="full_control", script_rev="2")
def full_downgrade(ops, mc, table):
    ops.drop_table(table)
```

:::tip
使用 `replace=True` 时，自动结构迁移将完全由你的脚本控制，请确保 upgrade 和 downgrade 脚本能正确同步表的完整结构。
:::

### 注意事项

1. **自动迁移不可逆**：虽然系统会记录 revision 历史，但并不提供自动回滚功能。建议在生产环境操作前备份数据库。
2. **自定义脚本顺序**：自定义脚本在自动结构迁移之前执行，同一张表内按注册顺序执行。
3. **多引擎容错**：迁移按引擎分组执行，单个引擎失败不会影响其他引擎。
4. **配置热重载**：`ConfigReload` 事件会重新初始化数据库引擎并重建表，但不会执行迁移。
