package main

import (
	"log"
	"strconv"
	"time"

	"vote-system-backend/model"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/gin-contrib/cors"
)

func main() {
	db := initDB()

	r := gin.Default()
	r.Use(cors.Default())

	// auth
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

	// vote
	r.POST("/vote/create", func(c *gin.Context) {
		var req struct {
			Title     string   `json:"title"`
			Options   []string `json:"options"`
			Multi     bool     `json:"multi"`
			Deadline  int64    `json:"deadline"`
			CreatorID string   `json:"creator_id"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			Err(c, 400, "参数错误！")
			return
		}

		if req.Title == "" || len(req.Options) < 2 {
			Err(c, 400, "标题不能为空或至少两个选项！")
			return
		}

		voteID := generateID()
		vote := model.Vote{
			ID:        voteID,
			Title:     req.Title,
			Multi:     req.Multi,
			Deadline:  req.Deadline,
			CreatorID: req.CreatorID,
		}
		for _, opt := range req.Options {
			vote.Options = append(vote.Options, model.VoteOption{
				VoteID:  voteID,
				Content: opt,
				Count:   0,
			})
		}
		if err := db.Create(&vote).Error; err != nil {
			Err(c, 500, "创建投票失败！")
			return
		}
		c.JSON(200, gin.H{"message": "投票创建成功！", "id": vote.ID})
	})

	r.DELETE("/vote/delete/:id", func(c *gin.Context) {
		// var uri struct {
		// 	ID string `uri:"id"`
		// }

		// if err := c.ShouldBindUri(&uri); err != nil {
		// 	Err(c, 400, "参数错误")
		// 	return
		// }

		param_id := c.Param("id")

		idUnit, err := strconv.ParseUint(param_id, 10, 64)
		if err != nil {
			return
		}

		id := uint(idUnit)
		if err := db.First(&model.Vote{}, id).Error; err != nil {
			Err(c, 400, "投票 不存在")
			return
		}
		/// 权限

		if err := db.Delete(&model.Vote{}, id).Error; err != nil {
			Err(c, 500, "删除失败")
			return
		}

	})

	r.POST("/vote/update", func(c *gin.Context) {
		var req model.Vote

		if err := c.ShouldBind(&req); err != nil {
			Err(c, 400, "参数错误")
			return
		}

		if req.Title == "" || len(req.Options) < 2 {
			Err(c, 400, "标题不能为空或至少两个选项！")
			return
		}

		// 通过ID查找投票
		var existingVote model.Vote
		if err := db.Where("id = ?", req.ID).First(&existingVote).Error; err != nil {
			Err(c, 400, "投票不存在！")
			return
		}

		/// 身份判断

		// 更新投票
		if err := db.Save(&req).Error; err != nil {
			Err(c, 500, "更新投票失败！")
			return
		}

		c.JSON(200, gin.H{"message": "投票更新成功！"})
	})

	r.GET("/vote/:id", func(c *gin.Context) {
		param_id := c.Param("id")

		idUnit, err := strconv.ParseUint(param_id, 10, 64)
		if err != nil {
			return
		}

		id := uint(idUnit)
		var vote model.Vote
		if err := db.Preload("Options").First(vote, id); err != nil {
			Err(c, 400, "投票 不存在")
			return
		}

		c.JSON(200, gin.H{
			"data": vote,
		})

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

	db.AutoMigrate(&model.User{}, &model.Vote{}, &model.VoteOption{})

	return db
}

// 生成唯一ID（简单实现，可替换为更安全的UUID）
func generateID() uint {
	return uint(time.Now().Unix())
}
