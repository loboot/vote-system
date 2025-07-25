package middleware

import (
	"time"
	"vote-system-backend/config"
	"vote-system-backend/database"
	"vote-system-backend/dto"
	"vote-system-backend/model"

	jwt "github.com/appleboy/gin-jwt/v2"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

const (
	IdentityKey = "user_id"
)

type UserClaims struct {
	ID       uint   `json:"id`
	Username string `json:"username`
}

func PayloadFunc(data interface{}) jwt.MapClaims {
	if user, ok := data.(*model.User); ok {
		return jwt.MapClaims{
			jwt.IdentityKey: user.ID,
			"username":      user.Username,
		}
	}
	return jwt.MapClaims{}
}

func IdentityHandler(c *gin.Context) interface{} {
	claims := jwt.ExtractClaims(c)
	return &model.User{
		ID:       uint(claims[IdentityKey].(float64)),
		Username: claims["username"].(string),
	}
}

func Authorizator(data interface{}, c *gin.Context) bool {
	if userClaims, ok := data.(*model.User); ok {
		c.Set("user_id", userClaims.ID)
		c.Set("username", userClaims.Username)
		return true
	}
	return false
}

func Authenticator(c *gin.Context) (interface{}, error) {
	var loginReq dto.LoginRequest
	if err := c.ShouldBindJSON(&loginReq); err != nil {
		return "", jwt.ErrMissingLoginValues
	}

	var user model.User
	if err := database.GetDB().Where("username = ?", loginReq.Username).First(&user).Error; err != nil {
		return nil, jwt.ErrFailedAuthentication
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginReq.Password)); err != nil {
		return nil, jwt.ErrFailedAuthentication
	}

	return &user, nil
}

func JWT(cfg *config.Config) (*jwt.GinJWTMiddleware, error) {
	return jwt.New(&jwt.GinJWTMiddleware{
		Realm:       "vote-system",
		Key:         []byte(cfg.JWT.Secret),
		Timeout:     cfg.JWT.ExpireTime,
		MaxRefresh:  time.Hour * 24,
		IdentityKey: IdentityKey,

		PayloadFunc:     PayloadFunc,
		IdentityHandler: IdentityHandler,
		Authenticator:   Authenticator,
		Authorizator:    Authorizator,

		TokenLookup:   "header: Authorization",
		TokenHeadName: "Bearer",
		TimeFunc:      time.Now,
	})
}
