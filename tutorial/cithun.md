---
prev: NEPattern 1.0
next: Letoderea
---

# Cithun

[`Cithun`](https://github.com/ArcletProject/Cithun) 是 `Arclet Project` 下仿照 Linux 文件权限系统实现的权限管理模块，提供了一套完整的基于资源树的权限模型。

其特点有：
- 类 Unix 权限模型：使用 `AVAILABLE (a)`、`MODIFY (m)`、`VISIT (v)` 三位权限标志位，类似 Unix 的 `r/w/x`
- 资源树结构：以点分隔路径构建资源层级树，支持自动创建中间节点
- 角色与用户体系：支持角色继承（DAG），用户可挂载多个角色
- ACL 依赖系统：ACL 条目可跨主体、跨资源声明依赖，内置环检测
- 可插拔策略：通过 `PermissionEngine` 注册自定义策略回调，支持资源级 `attach` 装饰器
- 轨道路径 (Track)：有序角色等级，支持用户升降级操作
- 多种存储后端：内存、JSON 文件、SQLite
- 完整异步支持：`arclet.cithun.async_` 提供所有核心类的异步变体

## 安装

:::code-group
```bash:no-line-numbers [pdm]
pdm add "arclet-cithun"
```

```bash:no-line-numbers [uv]
uv add "arclet-cithun"
```

```bash:no-line-numbers [pip]
pip install "arclet-cithun"
```
:::

## 核心概念

Cithun 的权限模型围绕以下几个核心概念构建：

### Permission

`Permission` 是一个 `IntFlag` 枚举，定义了三个权限位：

| 标志位         | 简写  | 数值 | 类似 Unix  | 含义      |
|-------------|-----|----|----------|---------|
| `VISIT`     | `v` | 4  | `r` (读)  | 查看/读取资源 |
| `MODIFY`    | `m` | 2  | `w` (写)  | 修改资源    |
| `AVAILABLE` | `a` | 1  | `x` (执行) | 访问/使用资源 |

组合使用：
```python
from arclet.cithun import Permission

# 完整权限 (7)
full = Permission.VISIT | Permission.MODIFY | Permission.AVAILABLE

# 只读 (5)
readonly = Permission.VISIT | Permission.AVAILABLE

# 字符串解析
p = Permission("vma")    # VISIT | MODIFY | AVAILABLE
p = Permission("r-w-x")  # 同上，支持 - 分隔

# 格式化
f"{p:#}"  # "v-m-a"

# 表达式解析 (chmod 风格)
mask, mode, deny = Permission.parse("a=rwx")   # (7, "=", False)
mask, mode, deny = Permission.parse("d+vma")   # (7, "+", True) 设置 deny
mask, mode, deny = Permission.parse("+v")      # (4, "+", False)
```

### ResourceNode

资源节点是权限管理的基本单位，通过点分隔路径构成树形结构：

```python
from arclet.cithun import ResourceNode, InheritMode

# 节点: "app.data.config"
# 树结构:
#   app/
#   └── data/
#       └── config
```

继承模式控制子节点如何从父节点继承权限：

| 模式         | 行为                |
|------------|-------------------|
| `MERGE`    | 父节点与子节点的权限取并集（默认） |
| `OVERRIDE` | 仅使用子节点自身的权限       |
| `INHERIT`  | 完全继承父节点的权限        |

### User 与 Role

```python
from arclet.cithun import User, Role

alice = User(id="alice", name="Alice")
admin = Role(id="admin", name="Admin")
```

- **用户**可挂载多个角色，继承角色的所有权限
- **角色**支持 DAG 继承，可形成多级继承链
- 权限计算时会展开所有继承的角色，形成完整的主体集合

### AclEntry

访问控制条目将主体与资源的权限关联起来：

```python
from arclet.cithun import AclEntry, SubjectType, Permission

# 表示 admin 角色在 app.data 上拥有 v+m+a 权限
acl = AclEntry(
    subject_type=SubjectType.ROLE,
    subject_id="admin",
    resource_id="app.data",
    allow_mask=Permission.VISIT | Permission.MODIFY | Permission.AVAILABLE,
)
```

## 快速开始

使用内置的 `System` 类快速搭建权限系统：

```python
from arclet.cithun import Permission
from arclet.cithun.builtins import System

system = System()

# isolate 上下文会在退出时将状态保存到 JSON 文件
with system.isolate("data"):
    # 创建角色
    AUTH_1 = system.create_role("ROLE_AUTH_1", "AUTH_1")
    AUTH_2 = system.create_role("ROLE_AUTH_2", "AUTH_2")
    AUTH_3 = system.create_role("ROLE_AUTH_3", "AUTH_3")

    # 角色继承: AUTH_1 <- AUTH_2 <- AUTH_3
    system.inherit(AUTH_2, AUTH_1)
    system.inherit(AUTH_3, AUTH_2)

    # 创建用户
    alice = system.create_user("alice", "Alice")
    bob = system.create_user("bob", "Bob")

    # 用户挂载角色
    system.inherit(alice, AUTH_1)  # alice 拥有 AUTH_1
    system.inherit(bob, AUTH_3)    # bob 拥有 AUTH_3 及继承的角色

    # 在资源上分配权限
    system.assign(AUTH_1, "app", Permission.AVAILABLE)
    system.assign(AUTH_3, "app.data", Permission.VISIT | Permission.MODIFY)

    # 为用户单独分配权限
    system.assign(alice, "app.config", Permission.MODIFY)
```

### 权限校验

```python
# root 级校验（不检查调用者权限）
has_visit = system.test(alice, "app", Permission.VISIT)
has_modify = system.test(alice, "app", Permission.MODIFY)
print(f"alice 在 app 上拥有 VISIT: {has_visit}")   # False
print(f"alice 在 app 上拥有 MODIFY: {has_modify}")  # False

# 查看有效权限
mask = system.suget(alice, "app.data")
print(f"alice 在 app.data 上的权限: {mask:#}")      # 取决于角色继承后权限

# 查看权限视图
print(system.permission_on(alice, expand_inherited=True))
```

## 资源管理

### 定义资源

`define` 方法会自动创建路径上的中间节点：

```python
# 自动创建 app/ 和 app/data/
system.define("app.data.config", type_="GENERIC")

# 查看资源树
print(system.resource_tree())
# $
# └─ app/
#    └─ data/
#       └─ config
```

### 资源匹配

支持 glob 模式和自定义回调：

```python
# 使用 glob
system.suset(alice, "app.*", Permission.VISIT)

# 使用正则
import re
pattern = re.compile(r"app\.\w+")
system.assign(alice, pattern, Permission.VISIT | Permission.AVAILABLE)
```

## ACL 依赖

ACL 依赖允许声明某个资源的权限依赖于另一个主体在另一资源上的权限：

```python
# 形式1: 自己的 app.data 权限依赖于自己在 app.secret 上的 VISIT
system.depend("app.data", "app.secret", required_mask=Permission.VISIT)

# 形式2: 特定主体的依赖
system.depend(alice, "app.data", "app.secret", required_mask=Permission.VISIT)

# 形式3: 依赖其他主体的权限
system.depend("app.data", admin, "app.secret", required_mask=Permission.VISIT)

# 形式4: 完整形式
system.depend(alice, "app.data", bob, "app.secret", required_mask=Permission.VISIT)
```

当依赖不满足时，对应的 ACL 条目在权限计算中会被忽略。系统内置环检测，出现循环依赖时会抛出 `DependencyCycleError`。

## 执行者模式

Cithun 提供了类似 Unix 命令的权限操作接口：

```python
# suget / suset — root 级操作，不做权限校验
mask = system.suget(alice, "app.data")           # 获取权限
system.suset(alice, "app.data", Permission(7))   # 设置权限

# chmod — 使用表达式批量设置
system.chmod(alice, "app.*", "a=rwx")   # 所有 app 下资源设满权限
system.chmod(alice, "app.*", "d+v")     # 添加 deny VISIT

# get / set — 以执行者身份操作，会进行权限校验
try:
    mask = system.get(alice, "app.data")           # 需要 VISIT
    system.set(alice, bob, "app.data", +Permission.VISIT)  # 需要 V+M+A
except PermissionDeniedError as e:
    print(f"权限不足: {e}")
```

权限校验规则（对应 `rule.md`）：

| 操作 | 校验规则 |
|------|----------|
| `get` | 父节点需有 V+A，自身需有 V |
| `set` | 父节点需有 V+M+A，自身需有 M |
| `chmod` | 同 `suset`，无校验 |

## 角色继承

角色继承形成一个有向无环图（DAG），权限计算时会递归展开所有继承关系：

```python
# 继承链: AUTH_1 <- AUTH_2 <- AUTH_3 <- AUTH_4 <- AUTH_5
AUTH_1 = system.create_role("ROLE_AUTH_1", "AUTH_1")
AUTH_2 = system.create_role("ROLE_AUTH_2", "AUTH_2")
AUTH_3 = system.create_role("ROLE_AUTH_3", "AUTH_3")
AUTH_4 = system.create_role("ROLE_AUTH_4", "AUTH_4")
AUTH_5 = system.create_role("ROLE_AUTH_5", "AUTH_5")
system.inherit(AUTH_2, AUTH_1)
system.inherit(AUTH_3, AUTH_2)
system.inherit(AUTH_4, AUTH_3)
system.inherit(AUTH_5, AUTH_4)

# alice 继承 AUTH_1，因此获得 AUTH_1 的所有权限
# bob 继承 AUTH_3，因此获得 AUTH_1 ~ AUTH_3 的所有权限
system.inherit(alice, AUTH_1)
system.inherit(bob, AUTH_3)
```

## 策略系统

### PermissionEngine

通过 `PermissionEngine` 注册自定义策略，在静态 ACL 计算后对权限进行调整：

```python
from arclet.cithun import PermissionEngine, Permission

engine = PermissionEngine()

# 注册策略：工作时间外限制访问
def work_hours_only(user, resource, context, current_mask, permission_lookup):
    hour = context.get("hour", 0)
    if hour < 9 or hour > 18:
        return current_mask & ~Permission.VISIT  # 移除 VISIT
    return current_mask

engine.register_strategy(work_hours_only)
```

### Attacher 装饰器

`Attacher` 提供了更便捷的基于资源模式的回调注册：

```python
from arclet.cithun import User, Permission

# 匹配 app.data 及其子节点
@system.attach("app.data.*")
def data_attach(user: User, context, current_mask, permission_lookup):
    return Permission.VISIT  # 叠加 VISIT（等价于 "+"）

# 返回值形式:
#   Permission         — 叠加
#   (Permission, "+")  — 叠加
#   (Permission, "-")  — 移除
#   (Permission, "=")  — 覆盖

@system.attach("app.secret")
def secret_attach(user, context, current_mask, permission_lookup):
    # 可以查询其他主体的权限
    return (Permission.VISIT, "-")  # 移除 VISIT
```

## 轨道系统 (Track)

Track 提供有序的角色等级管理，支持升降级操作：

```python
# 创建轨道
track = system.create_track("user_level", "用户等级")

# 添加等级（从低到高）
system.add_track_level(track, AUTH_1, name="普通用户")
system.add_track_level(track, AUTH_3, name="高级用户")
system.add_track_level(track, AUTH_5, name="管理员")

# 升降级
system.promote_track(alice, track, step=1)   # 升到"高级用户"
system.demote_track(alice, track, step=1)     # 降回"普通用户"

# 获取当前等级
level = system.get_user_track_level(alice, track)
print(level.level_name)  # 普通用户

# 直接设置等级
system.set_user_track_level(alice, track, 2)  # 设置到索引 2（管理员）
```

## 存储后端

### JsonStore

使用 `System` 时，可通过 `isolate` 上下文管理器自动序列化到 JSON 文件：

```python
with system.isolate("my_config"):
    system.create_role("admin", "Admin")
    # ... 退出后自动保存到 my_config.json
```

### SimpleDatabaseStore

使用 `DBSystem` 可通过 SQLite 持久化：

```python
from arclet.cithun.builtins import DBSystem

db = DBSystem("perms.db")
with db.transaction():
    role = db.create_role("admin", "Admin")
    db.assign(role, "app", Permission(7))
    # 退出时自动提交到 SQLite
```

## 异步支持

所有核心类在 `arclet.cithun.async_` 下提供异步变体：

```python
from arclet.cithun.async_ import AsyncStore, AsyncPermissionService, AsyncPermissionExecutor
from arclet.cithun.async_.strategy import AsyncPermissionEngine

store = AsyncStore()
engine = AsyncPermissionEngine()
service = AsyncPermissionService(store, engine)
executor = AsyncPermissionExecutor(store, service)
```

异步策略：

```python
from arclet.cithun.async_.strategy import AclDependency

# 异步的 ACL 依赖
service.depend(
    AclDependency(
        target_resource_id="app.data",
        depend_resource_id="app.secret",
        required_mask=Permission.VISIT,
        # subject 参数支持异步 callable
    )
)
```

## 异常处理

```python
from arclet.cithun import (
    ResourceNotFoundError,    # 资源不存在
    PermissionDeniedError,    # 权限不足
    DependencyCycleError,     # ACL 依赖循环
)

try:
    mask = system.get(alice, "nonexistent.resource")
except ResourceNotFoundError as e:
    print(f"资源不存在: {e}")
except PermissionDeniedError as e:
    print(f"权限不足: {e}")
except DependencyCycleError as e:
    print(f"依赖循环: {e}")
```

## 全局配置

```python
from arclet.cithun.config import Config

Config.NODE_SEPARATOR = "."  # 资源路径分隔符，默认 "."
```
