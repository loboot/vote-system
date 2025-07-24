package utils

import (
	"net/http"
	"vote-system-backend/dto"

	"github.com/gin-gonic/gin"
)

func Success(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, dto.Response{
		Code:    200,
		Message: "success",
		Data:    data,
	})
}

func SuccessWithMessage(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, dto.Response{
		Code:    200,
		Message: message,
		Data:    data,
	})
}

func Error(c *gin.Context, code int, message string) {
	c.JSON(code, dto.ErrorResponse{
		Code:    code,
		Message: message,
	})
}

func ErrorWithDetail(c *gin.Context, code int, message string, err error) {
	response := dto.ErrorResponse{
		Code:    code,
		Message: message,
	}
	if err != nil {
		response.Error = err.Error()
	}
	c.JSON(code, response)
}
