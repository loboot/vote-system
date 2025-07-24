package model

import (
	"time"

	"gorm.io/gorm"
)

type Vote struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Title     string         `json:"title" gorm:"not null"`
	Multi     bool           `json:"multi" gorm:"default:false"`
	Deadline  int64          `json:"deadline"`
	CreatorID uint           `json:"creator_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// 关联
	Options   []VoteOption `json:"options" gorm:"foreignKey:VoteID;constraint:OnDelete:CASCADE"`
	UserVotes []UserVote   `json:"user_votes" gorm:"foreignKey:VoteID;constraint:OnDelete:CASCADE"`
}

type VoteOption struct {
	ID      uint   `json:"id" gorm:"primaryKey"`
	VoteID  uint   `json:"vote_id"`
	Content string `json:"content" gorm:"not null"`
	Count   int    `json:"count" gorm:"default:0"`

	// 关联
	UserVotes []UserVote `json:"user_votes" gorm:"foreignKey:OptionID;constraint:OnDelete:CASCADE"`
}

type UserVote struct {
	ID       uint `json:"id" gorm:"primaryKey"`
	UserID   uint `json:"user_id"`
	VoteID   uint `json:"vote_id"`
	OptionID uint `json:"option_id"`

	CreatedAt time.Time `json:"created_at"`

	// 复合唯一索引，防止重复投票
	// 单选：一个用户对一个投票只能有一条记录
	// 多选：一个用户对一个投票的同一选项只能有一条记录
}
