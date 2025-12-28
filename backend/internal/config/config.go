package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	DatabaseURL       string
	Port              string
	LogLevel          string
	SessionExpiryHours int
}

func Load() *Config {
	sessionExpiry, _ := strconv.Atoi(getEnv("SESSION_EXPIRY_HOURS", "24"))

	return &Config{
		DatabaseURL:       getEnv("DATABASE_URL", "postgres://fireuser:firepass@localhost:5432/fire_tracker?sslmode=disable"),
		Port:              getEnv("PORT", "8080"),
		LogLevel:          getEnv("LOG_LEVEL", "info"),
		SessionExpiryHours: sessionExpiry,
	}
}

func (c *Config) SessionExpiry() time.Duration {
	return time.Duration(c.SessionExpiryHours) * time.Hour
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
