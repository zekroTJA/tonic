package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func fail(ctx *gin.Context, code int, message string) {
	ctx.JSON(code, gin.H{
		"code":  code,
		"error": message,
	})
}

func failNotFound(ctx *gin.Context) {
	fail(ctx, http.StatusNotFound, "not found")
}

func failInternal(ctx *gin.Context, err error) {
	fail(ctx, http.StatusInternalServerError, err.Error())
}

func failBadRequest(ctx *gin.Context) {
	fail(ctx, http.StatusBadRequest, "bad request")
}

func failUnauthorized(ctx *gin.Context) {
	fail(ctx, http.StatusUnauthorized, "unauthorized")
}

func ok(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "ok",
	})
}

func (r *RestAPI) handlerCORS(ctx *gin.Context) {
	ctx.Header("Access-Control-Allow-Origin", "http://localhost:3000")
	ctx.Header("Access-Control-Allow-Method", "POST,GET,DELETE")
	ctx.Header("Access-Control-Allow-Headers", "Content-Type,Cookie")
	ctx.Header("Access-Control-Allow-Credentials", "true")
}
