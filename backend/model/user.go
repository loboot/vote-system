package model

import "time"

type User struct {
	ID           uint
	Username     string
	PasswordHash string
	CreatedAt    time.Time
	UpdatedAt    time.Time
}
