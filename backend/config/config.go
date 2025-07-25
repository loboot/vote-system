package config

import (
	"os"
	"time"
)

type Config struct {
	Port     string
	Database DatabaseConfig
	JWT      JWTConfig
}

type DatabaseConfig struct {
	DSN string
}

type JWTConfig struct {
	Secret     string
	ExpireTime time.Duration
}

func Load() *Config {
	return &Config{
		Port: getEnv("PORT", ":8080"),
		Database: DatabaseConfig{
			DSN: getEnv("DATABASE_DSN", "root:root@tcp(localhost:3306)/vote_db?charset=utf8mb4&parseTime=True&loc=Local"),
		},
		JWT: JWTConfig{
			ExpireTime: time.Hour * 24,
			Secret:     getEnv("JWT_SECRET", "default_secret_key"),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return defaultValue
}
