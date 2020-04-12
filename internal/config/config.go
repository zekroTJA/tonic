package config

import "github.com/kelseyhightower/envconfig"

type Config struct {
	ImageLocation string
	Address       string
	Password      string

	// Optional
	Debug       bool
	JWTSecret   string
	JWTExpire   string
	CacheMaxAge string
	WebDir      string
}

func New(prefix string) (c *Config, err error) {
	c = new(Config)
	err = envconfig.Process(prefix, c)
	return
}
