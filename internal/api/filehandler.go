package api

import (
	"path"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/zekroTJA/tonic/internal/util"
)

var fileRx = regexp.MustCompile(`^.*\.(ico|css|js|svg|gif|jpe?g|png)$`)

func (r *RestAPI) handlerFiles(ctx *gin.Context) {
	reqPath := ctx.FullPath()

	if fileRx.MatchString(reqPath) {
		ctx.Header("Content-Type", util.GetMimeType(reqPath))
		ctx.File(path.Join(r.webDir, reqPath))
	} else {
		ctx.Header("Content-Type", "text/html; charset=utf-8")
		ctx.File(path.Join(r.webDir, "/index.html"))
	}
}
