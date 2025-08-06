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

## 部署

1. 打包

   Windows:

   ```powershell
   $env:GOOS="linux"; $env:GOARCH="amd64"; go build -o vote-system main.go
   ```

2. 上传至Linux服务器

  ```powershell
  scp vote-system user@your_server:~
  ```

3. 配置systemd服务
4. 