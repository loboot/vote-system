package model

import "gorm.io/gorm"

// VoteOption 表示单个投票选项
type VoteOption struct {
	gorm.Model
	VoteID  uint   // 外键，关联Vote
	Content string // 选项内容
	Count   int    // 当前票数
}

// Vote 表示一个投票表单
type Vote struct {
	ID        uint
	Title     string       // 投票标题
	Options   []VoteOption `gorm:"foreignKey:VoteID"` // 投票选项
	Multi     bool         // 是否多选
	Deadline  int64        // 截止时间（时间戳）
	CreatorID string       // 创建者ID
}
