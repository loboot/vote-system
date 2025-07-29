# 投票系统

## 项目简介

本项目是一个基于 Go 的投票系统，前后端分离。后端仅提供 JSON API，前端使用 React 和 Tailwind CSS 实现响应式页面，支持手机和电脑端自适应。

## 主要功能

- 用户登录/注册
- 登录后可创建投票表单
- 支持单选/多选投票项
- 投票后实时显示结果，防止刷票
- 投票有截止时间，页面显示倒计时
- 投票结果以不同颜色、长度的横条展示，显示百分比和人数

## 技术栈

- 后端：Go 1.20+、Gin、GORM、MySQL
- 前端：React 18+、Zustand、Tailwind CSS、HTML5、CSS3、响应式设计
- 通信协议：RESTful JSON API

## 目录结构

```plaintext
vote-system/
├── backend/         # Go 后端代码
├── frontend/        # React 前端代码
└── README.md        # 项目说明文档
```

## 启动方式

### 后端

1. 进入 backend 目录，配置 .env 或 config.yaml 数据库等信息。
2. 执行如下命令启动后端服务：

```bash
go run main.go
```

### 前端

1. 进入 frontend 目录，执行如下命令启动开发服务器：

```bash
npm **install**
npm start
```

## 上下文（Agent Prompt）

- 后端所有接口只返回 JSON，不返回 HTML。
- 前端所有页面均由 React 动态生成。
- 每次功能更新需同步更新本 README。

## TODO

- [x] 用户认证与权限
- [x] 投票表单创建与管理
- [x] 投票功能（单选/多选）
- [x] 投票结果展示与防刷票
- [x] 投票倒计时
- [x] 响应式前端页面
- [ ] 双token校验
- [ ] 微信授权记录用户信息，以及防刷票
