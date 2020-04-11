package api

import (
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

const (
	jwtCookieName = "jwt_auth"
	jwtSubject    = "generic"
)

var jwtGenerationMethod = jwt.SigningMethodHS256

func (r *RestAPI) handleAuthLogin(ctx *gin.Context) {
	var login loginModel
	if err := ctx.ShouldBindJSON(&login); err != nil || login.Password == "" {
		failBadRequest(ctx)
		return
	}

	if login.Password != r.cfg.Password {
		failUnauthorized(ctx)
		return
	}

	token, err := jwt.NewWithClaims(jwtGenerationMethod, jwt.StandardClaims{
		Subject:   jwtSubject,
		ExpiresAt: time.Now().Add(r.authExpire).Unix(),
	}).SignedString(r.authSecret)

	if err != nil {
		failInternal(ctx, err)
		return
	}

	ctx.SetCookie(jwtCookieName, token, int(r.authExpire.Seconds()), "", "", false, true)

	ctx.Status(http.StatusOK)
}

func (r *RestAPI) handleAuthCheck(ctx *gin.Context) {
	token, err := ctx.Cookie(jwtCookieName)
	if err != nil {
		failUnauthorized(ctx)
		ctx.Abort()
		return
	}

	tokenObj, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return r.authSecret, nil
	})
	if err != nil || !tokenObj.Valid {
		failUnauthorized(ctx)
		ctx.Abort()
		return
	}

	claims, ok := tokenObj.Claims.(jwt.MapClaims)
	if !ok || claims["sub"] != jwtSubject {
		failUnauthorized(ctx)
		ctx.Abort()
		return
	}

	ctx.Next()
	return
}
