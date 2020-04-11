package api

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// GET /api/images
func (r *RestAPI) handlerGetImages(ctx *gin.Context) {
	images, err := r.img.List()
	if err != nil {
		failInternal(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, listWrapper{
		Count: len(images),
		Data:  images,
	})
}

// GET /api/images/:image
func (r *RestAPI) handlerGetImage(ctx *gin.Context) {
	imageName := ctx.Param("image")

	image, err := r.img.Get(imageName)
	if os.IsNotExist(err) {
		failNotFound(ctx)
		return
	}
	if err != nil {
		failInternal(ctx, err)
		return
	}

	reader, err := r.img.GetReader(imageName)
	if err != nil {
		failInternal(ctx, err)
		return
	}

	ctx.DataFromReader(http.StatusOK, image.Size, image.MimeType, reader, map[string]string{
		"Cache-Control": r.cacheHeader,
	})
}

// GET /api/images/:image/info
func (r *RestAPI) handlerGetImageInfo(ctx *gin.Context) {
	imageName := ctx.Param("image")

	image, err := r.img.Get(imageName)
	if os.IsNotExist(err) {
		failNotFound(ctx)
		return
	}
	if err != nil {
		failInternal(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, image)
}
