package config

import "os"

type Config struct {
	Port     string
	Database DatabaseConfig
}

type DatabaseConfig struct {
	DSN string
}

func Load() *Config {
	return &Config{
		Port: getEnv("PORT", ":8080"),
		Database: DatabaseConfig{
			DSN: getEnv("DATABASE_DSN", "root:root@tcp(localhost:3306)/vote_db?charset=utf8mb4&parseTime=True&loc=Local"),
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}

	return defaultValue
}
