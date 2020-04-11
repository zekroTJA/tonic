package api

import (
	"crypto/rand"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zekroTJA/tonic/internal/config"
	"github.com/zekroTJA/tonic/internal/imgstore"
)

var defAuthExpire = 30 * 24 * time.Hour

type RestAPI struct {
	cfg *config.Config
	img imgstore.ImageStore

	authSecret []byte
	authExpire time.Duration

	router *gin.Engine
}

func New(cfg *config.Config, img imgstore.ImageStore) (r *RestAPI, err error) {
	if cfg.Debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	r = new(RestAPI)
	r.cfg = cfg
	r.img = img

	if cfg.JWTSecret != "" {
		r.authSecret = []byte(cfg.JWTSecret)
	} else {
		if r.authSecret, err = generateAuthSecret(); err != nil {
			return
		}
	}

	if cfg.JWTExpire != "" {
		if r.authExpire, err = time.ParseDuration(cfg.JWTExpire); err != nil {
			return
		}
	} else {
		r.authExpire = defAuthExpire
	}

	r.router = gin.Default()

	{
		api := r.router.Group("/api")

		{
			auth := api.Group("/auth")
			auth.
				POST("/login", r.handleAuthLogin)
		}

		{
			images := api.Group("/images", r.handleAuthCheck)
			images.
				GET("", r.handlerGetImages).
				GET("/:image", r.handlerGetImage)
		}
	}

	return
}

func (r *RestAPI) Run() error {
	return r.router.Run(r.cfg.Address)
}

func generateAuthSecret() (key []byte, err error) {
	key = make([]byte, 32)
	_, err = rand.Read(key)
	return
}
