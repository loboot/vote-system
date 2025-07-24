# Vote System Backend

一个使用Go + Gin + GORM构建的现代化投票系统后端API。

## 项目结构

```
backend/
├── config/          # 配置文件
├── controller/      # 控制器层
├── database/        # 数据库连接
├── dto/            # 数据传输对象
├── middleware/     # 中间件
├── model/          # 数据模型
├── router/         # 路由配置
├── service/        # 业务逻辑层
├── utils/          # 工具函数
├── main.go         # 程序入口
├── go.mod          # Go模块文件
└── .env            # 环境变量
```

## 功能特性

- 用户注册/登录
- 创建投票
- 参与投票（支持单选/多选）
- 查看投票结果
- 投票管理（更新/删除）
- RESTful API设计
- 数据库自动迁移
- CORS支持

## API接口

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 投票相关
- `POST /api/vote/create` - 创建投票
- `GET /api/vote/:id` - 获取投票详情
- `PUT /api/vote/update` - 更新投票
- `DELETE /api/vote/:id` - 删除投票
- `POST /api/vote/submit` - 提交投票
- `GET /api/vote/my` - 获取我创建的投票
- `GET /api/vote/all` - 获取所有投票

## 快速开始

### 1. 安装依赖
```bash
go mod tidy
```

### 2. 配置数据库
确保MySQL数据库运行，并创建数据库：
```sql
CREATE DATABASE vote_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量
修改 `.env` 文件：
```env
PORT=8080
DATABASE_DSN=root:password@tcp(127.0.0.1:3306)/vote_db?charset=utf8mb4&parseTime=True&loc=Local
```

### 4. 运行项目
```bash
go run main.go
```

服务器将在 `http://localhost:8080` 启动。

## 数据模型

### User (用户)
| Field         | Type         | Description |
| ------------- | ------------ | ----------- |
| id            | INT          | 用户ID      |
| username      | VARCHAR(32)  | 用户名      |
| password_hash | VARCHAR(255) | 密码哈希    |
| created_at    | DATETIME     | 创建时间    |
| updated_at    | DATETIME     | 更新时间    |

### Vote (投票)
| Field      | Type         | Description |
| ---------- | ------------ | ----------- |
| id         | INT          | 投票ID      |
| title      | VARCHAR(255) | 投票标题    |
| multi      | BOOLEAN      | 是否多选    |
| deadline   | BIGINT       | 截止时间戳  |
| creator_id | INT          | 创建者ID    |
| created_at | DATETIME     | 创建时间    |
| updated_at | DATETIME     | 更新时间    |

### Vote_Options (投票选项)
| Field   | Type         | Description |
| ------- | ------------ | ----------- |
| id      | INT          | 选项ID      |
| vote_id | INT          | 投票ID      |
| content | VARCHAR(255) | 选项内容    |
| count   | INT          | 票数        |

### User_Votes (用户投票记录)
| Field      | Type     | Description |
| ---------- | -------- | ----------- |
| id         | INT      | 记录ID      |
| user_id    | INT      | 用户ID      |
| vote_id    | INT      | 投票ID      |
| option_id  | INT      | 选项ID      |
| created_at | DATETIME | 投票时间    |

## 技术栈

- **Web框架**: Gin
- **ORM**: GORM
- **数据库**: MySQL
- **认证**: bcrypt (密码加密)
- **跨域**: gin-contrib/cors

## API文档

详细的API文档请查看: [API.md](./API.md)

包含以下内容:
- 完整的接口文档
- 请求/响应示例
- 错误码说明
- cURL和JavaScript调用示例

## API测试

### Postman集合
导入 `Vote_System_API.postman_collection.json` 到Postman进行API测试。

### 命令行测试
```bash
# Linux/Mac
chmod +x test_api.sh
./test_api.sh

# Windows PowerShell
.\test_api.ps1
```