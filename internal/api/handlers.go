package api

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/zekroTJA/tonic/internal/imgstore"
	"github.com/zekroTJA/tonic/internal/util"
)

// GET /api/images
func (r *RestAPI) handlerGetImages(ctx *gin.Context) {
	offset := util.AtoiDef(ctx.Query("offset"), 0)
	n := util.AtoiDef(ctx.Query("n"), 100)

	images, err := r.img.List(offset, n)
	if err != nil {
		failInternal(ctx, err)
		return
	}

	ctx.JSON(http.StatusOK, listWrapper{
		Count:  len(images),
		Offset: offset,
		Data:   images,
	})
}

// GET /images/:image
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

// GET /images/:image/thumbnail
func (r *RestAPI) handlerGetImageThumbnail(ctx *gin.Context) {
	imageName := ctx.Param("image")
	width := util.AtoiDef(ctx.Query("width"), 200)
	height := util.AtoiDef(ctx.Query("height"), 200)

	imgReader, size, err := r.tn.GetThumbnail(imageName, width, height)
	if os.IsNotExist(err) {
		failNotFound(ctx)
		return
	}
	if err != nil {
		failInternal(ctx, err)
		return
	}

	defer imgReader.Close()
	ctx.DataFromReader(http.StatusOK, int64(size), util.GetMimeType(".jpg"), imgReader, nil)
}

// GET /api/images/:image
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

// POST /api/images/:image
func (r *RestAPI) handlerPostImageInfo(ctx *gin.Context) {
	imageName := ctx.Param("image")

	var newImage imgstore.Image
	if err := ctx.ShouldBindJSON(&newImage); err != nil {
		failBadRequest(ctx)
		return
	}

	image, err := r.img.Get(imageName)
	if os.IsNotExist(err) {
		failNotFound(ctx)
		return
	}
	if err != nil {
		failInternal(ctx, err)
		return
	}

	if imageName != newImage.Name {
		if util.GetExtension(imageName) != util.GetExtension(newImage.Name) {
			fail(ctx, http.StatusBadRequest, "file extension must not change")
			return
		}
		if err := r.img.Rename(imageName, newImage.Name); err != nil {
			failInternal(ctx, err)
			return
		}
	}

	image.Name = newImage.Name

	ctx.JSON(http.StatusOK, image)
}

// DELETE /api/images/:image
func (r *RestAPI) handlerDeleteImageInfo(ctx *gin.Context) {
	imageName := ctx.Param("image")

	err := r.img.Delete(imageName)
	if os.IsNotExist(err) {
		failNotFound(ctx)
		return
	}
	if err != nil {
		failInternal(ctx, err)
		return
	}

	ok(ctx)
}
