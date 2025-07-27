package service

import (
	"errors"
	"time"
	"vote-system-backend/database"
	"vote-system-backend/dto"
	"vote-system-backend/model"

	"gorm.io/gorm"
)

type VoteService struct{}

func NewVoteService() *VoteService {
	return &VoteService{}
}

func validSubmit(userId uint, voteId uint) bool {
	// 检查是否投过票
	var existingUserVote model.UserVote
	if err := database.GetDB().Where("user_id = ? AND vote_id = ?", userId, voteId).First(&existingUserVote).Error; err == nil {
		return false
	}
	return true
}

func (s *VoteService) CreateVote(req *dto.CreateVoteRequest, creatorID uint) (*model.Vote, error) {
	vote := model.Vote{
		Title:     req.Title,
		Multi:     req.Multi,
		Deadline:  req.Deadline,
		CreatorID: creatorID,
	}

	// 创建选项
	for _, optContent := range req.Options {
		vote.Options = append(vote.Options, model.VoteOption{
			Content: optContent,
			Count:   0,
		})
	}

	if err := database.GetDB().Create(&vote).Error; err != nil {
		return nil, err
	}

	return &vote, nil
}

// 定义返回结构体
type VoteWithStatus struct {
	model.Vote
	HasVoted bool `json:"has_voted"`
}

func (s *VoteService) GetVote(id uint, userId uint) (*VoteWithStatus, error) {
	var vote model.Vote
	if err := database.GetDB().Preload("Options").First(&vote, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("投票不存在")
		}
		return nil, err
	}

	// 检查用户是否已投票
	hasVoted := !validSubmit(userId, vote.ID)

	return &VoteWithStatus{
		Vote:     vote,
		HasVoted: hasVoted,
	}, nil
}

func (s *VoteService) UpdateVote(req *dto.UpdateVoteRequest, userID uint) error {
	var vote model.Vote
	if err := database.GetDB().Preload("Options").First(&vote, req.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("投票不存在")
		}
		return err
	}

	// 检查权限
	if vote.CreatorID != userID {
		return errors.New("没有权限修改此投票")
	}

	// 开始事务
	tx := database.GetDB().Begin()

	// 删除旧选项
	if err := tx.Where("vote_id = ?", vote.ID).Delete(&model.VoteOption{}).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 更新投票信息
	vote.Title = req.Title
	vote.Multi = req.Multi
	vote.Deadline = req.Deadline

	if err := tx.Save(&vote).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 创建新选项
	for _, optContent := range req.Options {
		option := model.VoteOption{
			VoteID:  vote.ID,
			Content: optContent,
			Count:   0,
		}
		if err := tx.Create(&option).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func (s *VoteService) DeleteVote(id uint, userID uint) error {
	var vote model.Vote
	if err := database.GetDB().First(&vote, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("投票不存在")
		}
		return err
	}

	// 检查权限
	if vote.CreatorID != userID {
		return errors.New("没有权限删除此投票")
	}

	return database.GetDB().Delete(&vote).Error
}

func (s *VoteService) Vote(req *dto.VoteRequest, userID uint) error {
	// 检查投票是否存在
	var vote model.Vote
	if err := database.GetDB().Preload("Options").First(&vote, req.VoteID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("投票不存在")
		}
		return err
	}

	// 检查是否投过票
	if !validSubmit(userID, vote.ID) {
		return errors.New("已投过票")
	}

	// 检查是否已过期
	if vote.Deadline > 0 && time.Now().Unix() > vote.Deadline {
		return errors.New("投票已过期")
	}

	// 检查选项是否有效
	validOptions := make(map[uint]bool)
	for _, option := range vote.Options {
		validOptions[option.ID] = true
	}

	for _, optionID := range req.OptionIDs {
		if !validOptions[optionID] {
			return errors.New("无效的选项")
		}
	}

	// 开始事务
	tx := database.GetDB().Begin()

	// 如果是单选，删除用户之前的投票
	if !vote.Multi {
		if err := tx.Where("user_id = ? AND vote_id = ?", userID, req.VoteID).Delete(&model.UserVote{}).Error; err != nil {
			tx.Rollback()
			return err
		}

		// 减少之前选项的计数
		if err := tx.Exec("UPDATE vote_options SET count = count - 1 WHERE id IN (SELECT option_id FROM user_votes WHERE user_id = ? AND vote_id = ?)", userID, req.VoteID).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	// 添加新的投票记录
	for _, optionID := range req.OptionIDs {
		userVote := model.UserVote{
			UserID: userID,
			VoteID: req.VoteID,
		}

		if err := tx.Create(&userVote).Error; err != nil {
			tx.Rollback()
			return err
		}

		// 更新选项计数
		if err := tx.Model(&model.VoteOption{}).Where("id = ?", optionID).UpdateColumn("count", gorm.Expr("count + 1")).Error; err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit().Error
}

func (s *VoteService) GetUserVotes(userID uint) ([]model.Vote, error) {
	var votes []model.Vote
	if err := database.GetDB().Where("creator_id = ?", userID).Preload("Options").Find(&votes).Error; err != nil {
		return nil, err
	}
	return votes, nil
}

func (s *VoteService) GetAllVotes() ([]model.Vote, error) {
	var votes []model.Vote
	if err := database.GetDB().Preload("Options").Find(&votes).Error; err != nil {
		return nil, err
	}
	return votes, nil
}
