## 项目结构

```
data-authority-security             主项目
    -- src
        -- auth                     鉴权
            -- classic.ts           classic鉴权
            -- oceanbase.ts         oceanbase鉴权
        -- consts                   枚举
        -- decorator                装饰器
        -- exception                异常
        -- utils                    工具函数
data-authority-security-test        模拟接口测试
    -- test                         相关接口测试脚本
```

## 使用教程

### 安装依赖包，已经在 npm 公服发布(此包无具体业务信息)；后期会迁移到公司的私服

```bash
  npm i data-authority-security --save
```

### 环境变量配置

```bash
# oceanbase url
OCEANBASE_AUTH_HOST = 'http://oceanbase-url'
# classic url
CLASSIC_AUTH_HOST = 'http://classic-url'
```

### tsconfig 设置

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### 相关枚举设置

```typescript
enum hierarchyType {
  BL = -3,
  SP = -2,
  CUSTOMER = -1,
  ORGANIZATION = 0,
  SITE = 1,
  BUILDING = 2,
  ROOM = 3,
  PANEL = 4,
  DEVICE = 5,
  AREA = 6,
  CIRCUIT = 7
}
enum logic {
  and = 1,
  or = 2
}
enum checkType {
  oceanbase = "oceanbase",
  classic = "classic",
  custom = "custom"
}
```

### 验证失败会抛出如下异常

```typescript
// 验证失败会抛出自定义异常，如果有中间件全局处理可自行处理；
// 不处理请求返回http：500，返回的具体错误结构如下：
{
    "code": "-99",
    "message": "[DataPrivilege] auth fail",
    "data": false
}
```

### 参数取值
- 在目前bff工程中，参数来源根据请求方式进行区分：get、post
- get：参数从url中进行获取，bff框架整理成object
- post：参数从body中获取，即使url中携带了参数，因为bff框架没有做url参数和body参数的merge，我们拿到的也是body中参数
- 不存在route途径参数

### 注解参数：共两个注解：dataPrivilegeDecorator、dataPrivilegeDecorators

#### dataPrivilegeDecorator 参数共三个：hierarchy、key、params

- hierarchy: 上面枚举中 hierarchyType，表示查询的层级
- key: string，表示参数的 key，在参数中进行 id 获取
- params?: 可选参数，对象结构
  - checkType: checkType，表示验证类型，oceanbase、classic、custom
  - logic?: 可选参数，表示逻辑关系，and、or
  - hasDataAuth?: 可选参数，当 checkType 为 custom 时，使用此函数进行验证，返回 true 表示验证通过，false 表示验证失败

```typescript
// 默认检查类型 - oceanbase
@dataPrivilegeDecorator(hierarchyType.BL, 'hierarchyId')
testBL(variables: Variables) {
    return success
}

// 检查类型 - classic
@dataPrivilegeDecorator(hierarchyType.SP, 'hierarchyId',{checkType: checkType.classic})
testSP(variables: Variables) {
    return success
}
@dataPrivilegeDecorator(hierarchyType.CUSTOMER, 'hierarchyId',{checkType: checkType.classic})
testCustomer(variables: Variables) {
    return success
}
// 默认检查类型 - oceanbase
@dataPrivilegeDecorator(hierarchyType.ORGANIZATION, 'hierarchyId')
testOrganization(variables: Variables) {
    return success
}
@dataPrivilegeDecorator(hierarchyType.BUILDING, 'hierarchyId')
testBuilding(variables: Variables) {
    return success
}
// 检查类型自定义，并且提供hasDataAuth校验函数
@dataPrivilegeDecorator(hierarchyType.ROOM, 'hierarchyId',{checkType: checkType.custom,hasDataAuth: () => true})
testRoom(variables: Variables) {
    return success
}
@dataPrivilegeDecorator(hierarchyType.PANEL, 'hierarchyId',{checkType: checkType.custom,hasDataAuth: () => true})
testPanel(variables: Variables) {
    return success
}
```

#### dataPrivilegeDecorators 参数共三个：Array<hierarchyParams>、params

- Array<hierachyParams>: hierachyParams 数组
  - hierachyParams 组成为：type、key
    - type: 上面枚举中 hierarchyType，表示查询的层级
    - key: string，表示参数的 key，在参数中进行 id 获取
- params?: 可选参数，对象结构
  - checkType: checkType，表示验证类型，oceanbase、classic、custom
  - logic?: 可选参数，表示逻辑关系，and、or
  - hasDataAuth?: 可选参数，当 checkType 为 custom 时，使用此函数进行验证，返回 true 表示验证通过，false 表示验证失败

```typescript
    @dataPrivilegeDecorators([{ type: hierarchyType.CUSTOMER, key: 'customerId' }])
    testOne(variables: Variables) {
        return success
    }

    @dataPrivilegeDecorators([{ type: hierarchyType.CUSTOMER, key: 'customerId' }, { type: hierarchyType.BUILDING, key: 'buildingId' }], { type: checkType.oceanbase, rel: logic.and })
    testTwoAnd(variables: Variables) {
        return success
    }

    @dataPrivilegeDecorators([{ type: hierarchyType.CUSTOMER, key: 'customerId' }, { type: hierarchyType.BUILDING, key: 'buildingId' }], { type: checkType.oceanbase, rel: logic.or })
    testTwoOr(variables: Variables) {
        return success
    }

    @dataPrivilegeDecorators([{ type: hierarchyType.CUSTOMER, key: 'customerId' }, { type: hierarchyType.BUILDING, key: 'buildingId' }, {type: hierarchyType.DEVICE, key: 'deviceId'}], { type: checkType.oceanbase, rel: logic.and })
    testThree(variables: Variables) {
        return success
    }

    @dataPrivilegeDecorators([{ type: hierarchyType.CUSTOMER, key: 'customerId' }, { type: hierarchyType.BUILDING, key: 'buildingId' }, {type: hierarchyType.DEVICE, key: 'deviceId'}, {type: hierarchyType.PANEL, key: 'panelId'}], { type: checkType.oceanbase, rel: logic.and })
    testMore(variables: Variables) {
        return success
    }
```
