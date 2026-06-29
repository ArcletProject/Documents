---
prev: 数据库插件
next: Tarina
---

# 权限插件

`entari-plugin-permission` 是 Entari 的官方权限插件，基于 [`Cithun`](../cithun.md) 提供了一套完整的、可持久化的用户/角色权限管理体系。

## 安装

:::code-group
```bash:no-line-numbers [pdm]
pdm add entari-plugin-permission
```

```bash:no-line-numbers [uv]
uv add entari-plugin-permission
```

```bash:no-line-numbers [pip]
pip install entari-plugin-permission
```
:::

:::warning
该插件依赖 `entari-plugin-database` 和 `entari-plugin-user`，需先配置好数据库服务。详见[数据库插件](./database.md)。
:::

## 配置

插件默认指令名为 `permission`，可通过配置修改：

```yaml title=entari.yml
plugins:
  database:  # 需先配置数据库
    type: sqlite
    name: data.db
  permission:
    command: permission  # 管理指令前缀
```

## 内置权限模型

插件启动后会自动创建以下默认角色与 Track：

- `group:default` — 所有用户创建后默认继承此角色
- `group:authority.x` — 权限角色:
  
  | 角色 ID               | 名称          |
  |---------------------|-------------|
  | `group:authority.1` | Authority 1 |
  | `group:authority.2` | Authority 2 |
  | `group:authority.3` | Authority 3 |
  | `group:authority.4` | Authority 4 |
  | `group:authority.5` | Authority 5 |

  继承关系：`AUTH_1 ← AUTH_2 ← AUTH_3 ← AUTH_4 ← AUTH_5`

## 内置 Track

Authority:

| 等级                | 角色     |
|-------------------|--------|
| `member`          | AUTH_1 |
| `advanced-member` | AUTH_2 |
| `admin`           | AUTH_3 |
| `senior-admin`    | AUTH_4 |
| `superuser`       | AUTH_5 |

插件会自动与 `entari-plugin-user` 的 `authority` 字段同步，当用户在 Track 上的等级变化时，`user.authority` 会自动更新。

`superuser` 拥有绕过所有权限检查的能力——当判断当前用户为 `superuser` 时，`has_permission` 直接返回完整权限。

## 管理指令

以下指令默认以 `/permission` 为前缀（实际前缀取决于 `Config.command`）。

### 用户权限

| 指令 | 功能 |
|------|------|
| `/permission user [@用户] list` | 列出用户的所有权限 |
| `/permission user [@用户] set <权限> <状态>` | 设置权限状态 |
| `/permission user [@用户] get <权限>` | 查询单个权限 |
| `/permission user [@用户] inherit <角色> [--cancel]` | 继承/取消角色 |
| `/permission user [@用户] promote <track>` | 提升 Track 等级 |
| `/permission user [@用户] demote <track>` | 降低 Track 等级 |

`set` 命令的状态值支持：

- `true` / `false` — 直接启用/禁用
- `a=rwx` — Cithun 的 `Permission.parse()` 权限表达式
- `+v`、`-m` — chmod 风格的快捷增减

`chmod` 快捷指令：

```text
/chmod <expr> <permission>
# 等价于
/permission user set <permission> <expr>
```

### Track 管理

| 指令 | 功能 |
|------|------|
| `/permission track <track> info` | 查看 Track 详情 |
| `/permission track <track> append <role>` | 末尾添加等级 |
| `/permission track <track> insert <role> <index>` | 指定位置插入等级 |
| `/permission track <track> remove <role>` | 移除等级 |
| `/permission track <track> clear` | 清空所有等级 |
| `/permission track <track> rename <name>` | 重命名 Track |
| `/permission listtrack` | 列出所有 Track |
| `/permission createtrack <track> [name]` | 创建 Track |
| `/permission deletetrack <track>` | 删除 Track |

## 权限点

插件自身的管理指令也有权限控制，所有权限点位于 `command.permission.*` 命名空间下：

| 权限点 | 说明 |
|--------|------|
| `command.permission.list` | 查看用户权限 |
| `command.permission.set` | 设置权限 |
| `command.permission.get` | 查询权限 |
| `command.permission.inherit` | 管理角色继承 |
| `command.permission.promote` | 提升 Track 等级 |
| `command.permission.demote` | 降低 Track 等级 |
| `command.permission.listtrack` | 列出 Track |
| `command.permission.createtrack` | 创建 Track |
| `command.permission.deletetrack` | 删除 Track |
| `command.permission.track.*` | Track 各项子操作 |

默认权限预设：

```python
# group:default 对 command.permission 有 vma（默认可用）
# AUTH_1 对 command.permission.* 有 VISIT
# AUTH_3 对 command.permission.* 有 VISIT + AVAILABLE
```

## 开发者接口

在自己的插件中复用此权限系统：

```python
from entari_plugin_permission import (
    system,              # 权限系统核心实例
    Permission,          # Cithun Permission 枚举
    check_permission,    # 权限检查函数
    require_permission,  # Propagator 封装
    UserOwner,           # 可注入的 User 类型
    AUTH_1, AUTH_2, AUTH_3, AUTH_4, AUTH_5,  # 内置角色
    AUTHORITY,           # 内置 Track
)
```

### system

`system` 是权限系统的核心服务实例，集成了异步权限服务、执行器与 ORM 持久化存储。继承自 `PermissionService`（`launart.Service`），在 Entari 中作为服务自动注册。

```python
# 预定义角色、资源、权限（在插件加载阶段注册，启动后自动写入数据库）
system.pre_role("group:editor", "Editor")
system.pre_track("mod_level", "Moderator Track")
system.pre_assign(AUTH_1, "command.edit", Permission.VISIT)
system.pre_assign(AUTH_3, "command.edit", Permission.VISIT | Permission.AVAILABLE)

# 运行时操作
user = await system.get_or_create_user("user:123456", "Alice")
role = await system.get_role("group:editor")
await system.inherit(user, role)
await system.promote_track(user, AUTHORITY)
```

所有 `pre_*` 方法注册的数据会在插件启动、服务进入 `blocking` 阶段时批量写入数据库。运行时通过 `get_or_create_user` 等方法操作。

### check_permission

返回一个异步检查函数，可用于 `enter_if`、`Depends` 等场景：

```python
from entari_plugin_permission import check_permission

# 创建检查器
checker = check_permission("command.foo", prompt=True)

# 在过滤器中使用
@leto.on(SomeEvent).if_(checker)
async def handler():
    ...

# 在 Depends 中使用
async def my_handler(_: None = Depends(checker)):
    ...
```

参数：
- `permission` — 权限点名称（如 `"command.foo"`），会自动预定义资源节点
- `default_available` — 默认是否可用，默认为 `True`（即 `group:default` 拥有 `v-a`）
- `prompt` — 不满足时是否发送提示消息，默认为 `False`

### require_permission

`Propagator` 封装，适合挂载到 `propagate(...)` 上：

```python
from arclet.letoderea import propagate
from entari_plugin_permission import require_permission

@propagate(require_permission("command.foo", prompt=True))
async def handler():
    ...
```

当权限不满足时，会 `raise STOP` 阻止后续传播者执行。

### UserOwner

可直接注入的 Cithun `User` 对象，自动从当前会话提取用户：

```python
from arclet.cithun import User
from arclet.entari import command
from entari_plugin_permission import UserOwner

@command.on("mycmd")
async def handler(current_user: UserOwner):
    print(f"当前 Cithun 用户: {current_user.id}, {current_user.name}")
    # UserOwner 是 Annotated[User, Depends(get_user_model)] 的类型别名
```

### 自定义权限附加

通过 `system.attach(...)` 为特定资源动态追加权限：

```python
# 字符串模式 — 支持 glob 通配
@system.attach("command.foo")
async def foo_attach(user, context, current_mask, permission_lookup):
    if context and context.user.id == "admin":
        return Permission(7)  # 管理员直接满权限
    return current_mask

# 自定义谓词
@system.attach(lambda rid: rid.startswith("admin."))
async def admin_attach(user, rid, context, current_mask, permission_lookup):
    return (Permission.VISIT, "-")  # 移除 VISIT
```

回调签名：
```python
async def callback(
    user: User,
    context: UserSession | None,
    current_mask: Permission,
    permission_lookup: Callable,
) -> Permission | tuple[Permission, str]:
```

返回值：
- `Permission` — 叠加权限（等价 `"+"`）
- `(Permission, "+")` — 叠加
- `(Permission, "-")` — 移除
- `(Permission, "=")` — 覆盖

## 事件

插件定义了一个事件 `UserSetTrackLevel`，在用户 Track 等级变化时发布：

```python
from arclet.letoderea import on
from entari_plugin_permission import UserSetTrackLevel

@on(UserSetTrackLevel)
async def on_track_level_change(event: UserSetTrackLevel):
    print(f"用户 {event.user.name} 在 Track {event.track.name} 上升级到 {event.level.level_name}")
```

可用于外部同步、审计日志等场景。

## 完整示例

`example_plugin.py` 展示了一个完整用法：

```python
from arclet.alconna import Args, Alconna, store_true, Option
from arclet.cithun import Permission
from arclet.entari import Image, Session, command
from entari_plugin_permission import AUTH_3, require_permission, system, AUTH_1

# 注册指令和权限点
mask_cmd = command.mount(Alconna("设置词云形状", Args["img?", Image]))
mask_cmd.propagators.append(
    require_permission("command.mask", default_available=False, prompt=True)
)

@mask_cmd.handle()
async def mask(sess: Session, img: command.Match[Image]):
    ...

# 预定义角色、Track 和权限分配
MASK = system.pre_role("group:mask", "Mask")
mask_track = system.pre_track("mask_track", "Mask Track")
system.pre_track_level(mask_track, system.default_role, "default")
system.pre_track_level(mask_track, MASK, "mask")

system.pre_assign(MASK, "command.mask", Permission(7))
system.pre_assign(AUTH_1, "command.mask", Permission.VISIT)
system.pre_assign(AUTH_3, "command.mask", Permission.VISIT | Permission.AVAILABLE)
```

关于 `Permission` 枚举和 ACL 依赖的详细说明，请参阅 [Cithun 章节](../cithun.md)。
