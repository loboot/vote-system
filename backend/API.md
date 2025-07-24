# Vote System API 文档

## 基础信息

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

## 响应格式

### 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {...}
}
```

### 错误响应
```json
{
  "code": 400,
  "message": "错误信息",
  "error": "详细错误信息"
}
```

## 认证接口

### 用户注册

**POST** `/api/auth/register`

**请求体:**
```json
{
  "username": "string",        // 用户名 (3-20字符)
  "password": "string",        // 密码 (最少6字符)
  "confirmPassword": "string"  // 确认密码
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

**错误示例:**
```json
{
  "code": 400,
  "message": "用户名已存在"
}
```

---

### 用户登录

**POST** `/api/auth/login`

**请求体:**
```json
{
  "username": "string",  // 用户名
  "password": "string"   // 密码
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser"
    },
    "token": "mock-token"
  }
}
```

**错误示例:**
```json
{
  "code": 400,
  "message": "用户不存在"
}
```

---

## 投票接口

### 创建投票

**POST** `/api/vote/create`

**请求体:**
```json
{
  "title": "string",      // 投票标题 (必填)
  "options": [            // 投票选项 (至少2个)
    "选项1",
    "选项2"
  ],
  "multi": false,         // 是否支持多选 (默认false)
  "deadline": 1693478400  // 截止时间戳 (可选，0表示无截止时间)
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "投票创建成功",
  "data": {
    "id": 1
  }
}
```

---

### 获取投票详情

**GET** `/api/vote/{id}`

**路径参数:**
- `id`: 投票ID

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "最喜欢的编程语言",
    "multi": false,
    "deadline": 1693478400,
    "creator_id": 1,
    "created_at": "2023-08-31T10:00:00Z",
    "updated_at": "2023-08-31T10:00:00Z",
    "options": [
      {
        "id": 1,
        "vote_id": 1,
        "content": "Go",
        "count": 5
      },
      {
        "id": 2,
        "vote_id": 1,
        "content": "Python",
        "count": 3
      }
    ]
  }
}
```

---

### 更新投票

**PUT** `/api/vote/update`

**请求体:**
```json
{
  "id": 1,                // 投票ID (必填)
  "title": "string",      // 投票标题 (必填)
  "options": [            // 投票选项 (至少2个)
    "新选项1",
    "新选项2"
  ],
  "multi": true,          // 是否支持多选
  "deadline": 1693478400  // 截止时间戳
}
```

**响应示例:**
```json
{
  "code": 200,
  "message": "投票更新成功",
  "data": null
}
```

**错误示例:**
```json
{
  "code": 400,
  "message": "没有权限修改此投票"
}
```

---

### 删除投票

**DELETE** `/api/vote/{id}`

**路径参数:**
- `id`: 投票ID

**响应示例:**
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

---

### 提交投票

**POST** `/api/vote/submit`

**请求体:**
```json
{
  "vote_id": 1,           // 投票ID (必填)
  "option_ids": [1, 2]    // 选择的选项ID列表 (必填)
}
```

**注意:**
- 单选投票: `option_ids` 只能包含一个选项ID
- 多选投票: `option_ids` 可以包含多个选项ID
- 重复投票会覆盖之前的选择(单选)或跳过已选择的选项(多选)

**响应示例:**
```json
{
  "code": 200,
  "message": "投票成功",
  "data": null
}
```

**错误示例:**
```json
{
  "code": 400,
  "message": "投票已过期"
}
```

---

### 获取我创建的投票

**GET** `/api/vote/my`

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "最喜欢的编程语言",
      "multi": false,
      "deadline": 1693478400,
      "creator_id": 1,
      "created_at": "2023-08-31T10:00:00Z",
      "updated_at": "2023-08-31T10:00:00Z",
      "options": [
        {
          "id": 1,
          "vote_id": 1,
          "content": "Go",
          "count": 5
        }
      ]
    }
  ]
}
```

---

### 获取所有投票

**GET** `/api/vote/all`

**响应示例:**
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "最喜欢的编程语言",
      "multi": false,
      "deadline": 1693478400,
      "creator_id": 1,
      "created_at": "2023-08-31T10:00:00Z",
      "updated_at": "2023-08-31T10:00:00Z",
      "options": [
        {
          "id": 1,
          "vote_id": 1,
          "content": "Go",
          "count": 5
        },
        {
          "id": 2,
          "vote_id": 1,
          "content": "Python",
          "count": 3
        }
      ]
    }
  ]
}
```

---

## 状态码说明

| 状态码 | 说明           |
| ------ | -------------- |
| 200    | 请求成功       |
| 400    | 请求参数错误   |
| 401    | 未授权访问     |
| 404    | 资源不存在     |
| 500    | 服务器内部错误 |

## 错误码说明

| 错误信息             | 说明                             |
| -------------------- | -------------------------------- |
| "参数错误"           | 请求参数格式不正确或缺少必填参数 |
| "用户名已存在"       | 注册时用户名重复                 |
| "用户不存在"         | 登录时用户名不存在               |
| "密码错误"           | 登录时密码不正确                 |
| "两次密码不一致"     | 注册时确认密码与密码不匹配       |
| "投票不存在"         | 投票ID不存在                     |
| "投票已过期"         | 投票截止时间已过                 |
| "无效的选项"         | 提交的选项ID不属于该投票         |
| "没有权限修改此投票" | 只有创建者可以修改投票           |
| "没有权限删除此投票" | 只有创建者可以删除投票           |

## 使用示例

### cURL 示例

#### 用户注册
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

#### 用户登录
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

#### 创建投票
```bash
curl -X POST http://localhost:8080/api/vote/create \
  -H "Content-Type: application/json" \
  -d '{
    "title": "最喜欢的编程语言",
    "options": ["Go", "Python", "Java", "JavaScript"],
    "multi": false,
    "deadline": 1693478400
  }'
```

#### 获取投票详情
```bash
curl -X GET http://localhost:8080/api/vote/1
```

#### 提交投票
```bash
curl -X POST http://localhost:8080/api/vote/submit \
  -H "Content-Type: application/json" \
  -d '{
    "vote_id": 1,
    "option_ids": [1]
  }'
```

#### 获取所有投票
```bash
curl -X GET http://localhost:8080/api/vote/all
```

### JavaScript 示例

#### 用户注册
```javascript
const registerUser = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: '123456',
        confirmPassword: '123456'
      })
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

#### 创建投票
```javascript
const createVote = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/vote/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '最喜欢的编程语言',
        options: ['Go', 'Python', 'Java', 'JavaScript'],
        multi: false,
        deadline: 1693478400
      })
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## 数据库设计

### 数据表关系
```
User (用户表)
├── id (主键)
├── username (用户名，唯一)
├── password_hash (密码哈希)
├── created_at (创建时间)
└── updated_at (更新时间)

Vote (投票表)
├── id (主键)
├── title (投票标题)
├── multi (是否多选)
├── deadline (截止时间)
├── creator_id (创建者ID，外键关联User.id)
├── created_at (创建时间)
└── updated_at (更新时间)

VoteOption (投票选项表)
├── id (主键)
├── vote_id (投票ID，外键关联Vote.id)
├── content (选项内容)
└── count (票数统计)

UserVote (用户投票记录表)
├── id (主键)
├── user_id (用户ID，外键关联User.id)
├── vote_id (投票ID，外键关联Vote.id)
├── option_id (选项ID，外键关联VoteOption.id)
└── created_at (投票时间)
```

## 注意事项

1. **数据验证**: 所有输入数据都会进行服务端验证
2. **密码安全**: 密码使用bcrypt加密存储，不会明文保存
3. **CORS支持**: 已配置跨域访问支持
4. **数据库迁移**: 首次运行会自动创建数据表结构
5. **并发安全**: 投票计数使用数据库事务保证一致性
6. **时间格式**: 使用Unix时间戳表示时间
