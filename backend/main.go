package main

import (
	"log"

	"vote-system-backend/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

func main() {
	db := initDB()

	r := gin.Default()

	r.POST("/register", func(c *gin.Context) {
		var req struct {
			Username string
			Password string
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			Err(c, 400, "参数错误!")
			log.Print(err)

			return
		}

		// 密码加密
		hash, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		user := model.User{
			Username:     req.Username,
			PasswordHash: string(hash),
		}

		if err := db.Create(&user).Error; err != nil {
			Err(c, 400, "用户名已存在!")
			log.Print(err)

			return
		}

		c.JSON(200, gin.H{"message": "注册成功！"})
	})

	r.POST("/login", func(c *gin.Context) {
		var req struct {
			Username string
			Password string
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			Err(c, 400, "参数错误！")
			log.Print(err)

			return
		}

		var user model.User
		print(db.Where("username = ?", req.Username))
		if err := db.Where("username = ?", req.Username).First(&user).Error; err != nil {
			Err(c, 400, "用户不存在！")
			log.Print(err)

			return
		}
		log.Print(user)
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			Err(c, 400, "密码错误！")
			log.Print(err)

			return
		}

		c.JSON(200, "登录成功")

	})
	r.Run()
}

func Err(c *gin.Context, code int, err string) {
	c.JSON(code, gin.H{"error": err})
}

func initDB() *gorm.DB {
	dsn := "root:root@tcp(127.0.0.1:3306)/vote_db?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("数据库连接失败:", err)
	}

	db.AutoMigrate(&model.User{})

	return db
}
