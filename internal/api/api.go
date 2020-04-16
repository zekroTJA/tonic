package api

import (
	"crypto/rand"
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/zekroTJA/tonic/internal/config"
	"github.com/zekroTJA/tonic/internal/hashing"
	"github.com/zekroTJA/tonic/internal/imgstore"
	"github.com/zekroTJA/tonic/internal/thumbnails"
)

var (
	defAuthExpire  = 30 * 24 * time.Hour
	defCacheMaxAge = 30 * 24 * time.Hour
)

type RestAPI struct {
	cfg *config.Config
	img imgstore.ImageStore

	authHash   []byte
	authSecret []byte
	authExpire time.Duration

	cacheHeader string
	webDir      string

	tn     *thumbnails.Thumbnailer
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
	r.tn = thumbnails.New(cfg.ThumbnailCache, img)

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

	if cfg.WebDir != "" {
		r.webDir = cfg.WebDir
	} else {
		r.webDir = "./web"
	}

	if strings.HasPrefix(cfg.Password, "$") {
		r.authHash = hashing.StrToBytes(cfg.Password)
	} else {
		if r.authHash, err = hashing.GetHashB(cfg.Password, hashing.DefaultCost); err != nil {
			return
		}
	}
	if len(cfg.Password) < 1 {
		err = fmt.Errorf("no password configured")
		return
	}

	maxAge := defCacheMaxAge
	if cfg.CacheMaxAge != "" {
		maxAge, err = time.ParseDuration(cfg.CacheMaxAge)
		if err != nil {
			return
		}
	}
	r.cacheHeader = fmt.Sprintf("max-age=%.0f, public",
		math.Floor(maxAge.Seconds()))

	r.router = gin.Default()

	if r.cfg.Debug {
		r.router.Use(r.handlerCORS)
	}

	r.router.Use(r.handlePreflight)

	r.router.
		GET("/images/:image", r.handleAuthCheck, r.handlerGetImage).
		GET("/images/:image/thumbnail.jpg", r.handleAuthCheck, r.handlerGetImageThumbnail)

	{
		api := r.router.Group("/api")

		{
			auth := api.Group("/auth")
			auth.
				POST("/login", r.handleAuthLogin).
				POST("/logout", r.handlerAuthLogout).
				POST("/validate", r.handlerAuthValidate)
		}

		{
			images := api.Group("/images", r.handleAuthCheck)
			images.
				GET("", r.handlerGetImages).
				GET("/:image", r.handlerGetImageInfo).
				POST("/:image", r.handlerPostImageInfo).
				DELETE("/:image", r.handlerDeleteImageInfo)
		}
	}

	r.router.Use(r.handlerFiles)

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
