package router

import (
	"vote-system-backend/config"
	"vote-system-backend/controller"
	"vote-system-backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// 中间件
	r.Use(middleware.CORS())

	// 控制器
	authController := controller.NewAuthController()
	voteController := controller.NewVoteController()

	// 健康检查接口
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Vote System API is running",
			"version": "1.0.0",
		})
	})

	// 公共路由
	api := r.Group("/api")
	{
		// 认证路由
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.POST("/login", authController.Login)
		}

		// 投票相关路由（暂时不需要认证，便于测试）
		vote := api.Group("/vote")
		{
			vote.POST("/create", voteController.CreateVote)
			vote.GET("/:id", voteController.GetVote)
			vote.PUT("/update", voteController.UpdateVote)
			vote.DELETE("/:id", voteController.DeleteVote)
			vote.POST("/submit", voteController.Vote)
			vote.GET("/my", voteController.GetUserVotes)
			vote.GET("/all", voteController.GetAllVotes)
		}
	}

	return r
}
