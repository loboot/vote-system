package main

import (
	"log"
	"vote-system-backend/config"
	"vote-system-backend/database"
	"vote-system-backend/router"
)

func main() {
	// 加载配置
	cfg := config.Load()

	// 初始化数据库
	database.Init(cfg)

	// 设置路由
	r := router.SetupRouter(cfg)

	// 启动服务器
	log.Printf("服务器启动在端口 %s", cfg.Port)
	if err := r.Run(cfg.Port); err != nil {
		log.Fatal("服务器启动失败:", err)
	}
}
