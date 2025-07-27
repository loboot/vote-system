package controller

import (
	"net/http"
	"strconv"
	"vote-system-backend/dto"
	"vote-system-backend/service"
	"vote-system-backend/utils"

	"github.com/gin-gonic/gin"
)

type VoteController struct {
	voteService *service.VoteService
}

func NewVoteController() *VoteController {
	return &VoteController{
		voteService: service.NewVoteService(),
	}
}

func (ctrl *VoteController) CreateVote(c *gin.Context) {
	var req dto.CreateVoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "参数错误")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	vote, err := ctrl.voteService.CreateVote(&req, userID.(uint))
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "投票创建成功", gin.H{"id": vote.ID})
}

func (ctrl *VoteController) GetVote(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	userID := c.GetUint("user_id")
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "无效的ID")
		return
	}

	vote, err := ctrl.voteService.GetVote(uint(id), userID)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.Success(c, vote)
}

func (ctrl *VoteController) UpdateVote(c *gin.Context) {
	var req dto.UpdateVoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "参数错误")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	if err := ctrl.voteService.UpdateVote(&req, userID.(uint)); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "投票更新成功", nil)
}

func (ctrl *VoteController) DeleteVote(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Error(c, http.StatusBadRequest, "无效的ID")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	if err := ctrl.voteService.DeleteVote(uint(id), userID.(uint)); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "删除成功", nil)
}

func (ctrl *VoteController) Vote(c *gin.Context) {
	var req dto.VoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Error(c, http.StatusBadRequest, "参数错误")
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	if err := ctrl.voteService.Vote(&req, userID.(uint)); err != nil {
		utils.Error(c, http.StatusBadRequest, err.Error())
		return
	}

	utils.SuccessWithMessage(c, "投票成功", nil)
}

func (ctrl *VoteController) GetUserVotes(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.Error(c, http.StatusUnauthorized, "未授权")
		return
	}

	votes, err := ctrl.voteService.GetUserVotes(userID.(uint))
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, votes)
}

func (ctrl *VoteController) GetAllVotes(c *gin.Context) {
	votes, err := ctrl.voteService.GetAllVotes()
	if err != nil {
		utils.Error(c, http.StatusInternalServerError, err.Error())
		return
	}

	utils.Success(c, votes)
}
