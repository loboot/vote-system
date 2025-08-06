package database

import (
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"vote-system-backend/config"
	"vote-system-backend/model"
)

var DB *gorm.DB

func Init(cfg *config.Config) {
	var err error

	DB, err = gorm.Open(mysql.Open(cfg.Database.DSN), &gorm.Config{})
	if err != nil {
		log.Fatal("数据库连接失败:", err)
		panic("failed to connect database")
	}

	err = DB.AutoMigrate(&model.User{}, &model.Vote{}, &model.VoteOption{}, &model.UserVote{})
	if err != nil {
		log.Fatal("数据库迁移失败:", err)
	}

	log.Println("数据库连接成功")
}

func GetDB() *gorm.DB {
	return DB
}
