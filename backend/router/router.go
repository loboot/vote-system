package router

import (
	"log"
	"vote-system-backend/config"
	"vote-system-backend/controller"
	"vote-system-backend/middleware"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
)

func handlerMiddleWare(authMiddleware *jwt.GinJWTMiddleware) gin.HandlerFunc {
	return func(context *gin.Context) {
		errInit := authMiddleware.MiddlewareInit()
		if errInit != nil {
			log.Fatal("authMiddleware.MiddlewareInit() Error:" + errInit.Error())
		}
	}
}

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.Default()

	// 中间件
	jwtMiddleware, err := middleware.JWT(cfg)
	if err != nil {
		log.Fatal("JWT Error:" + err.Error())
	}

	r.Use(middleware.CORS())

	handlerMiddleWare(jwtMiddleware)

	// 控制器
	authController := controller.NewAuthController()
	voteController := controller.NewVoteController()

	// 公共路由
	api := r.Group("/api")
	{
		// 认证路由
		auth := api.Group("/auth")
		{
			auth.POST("/register", authController.Register)
			auth.GET("/profile", jwtMiddleware.MiddlewareFunc(), authController.GetProfile)

			auth.POST("/login", jwtMiddleware.LoginHandler)
			auth.POST("/refresh", jwtMiddleware.RefreshHandler)
		}

		vote := api.Group("/vote", jwtMiddleware.MiddlewareFunc())
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
