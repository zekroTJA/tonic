package thumbnails

import (
	"bytes"
	"fmt"
	"image"
	"image/gif"
	"image/jpeg"
	"image/png"
	"io"
	"io/ioutil"
	"os"
	"path"

	"github.com/nfnt/resize"
	"github.com/zekroTJA/tonic/internal/imgstore"
	"github.com/zekroTJA/tonic/internal/util"
	"golang.org/x/image/bmp"
	"golang.org/x/image/tiff"
)

type Thumbnailer struct {
	img      imgstore.ImageStore
	cacheLoc string
}

type imageDecoder func(r io.Reader) (image.Image, error)

func New(cacheLog string, imgageStroe imgstore.ImageStore) *Thumbnailer {
	t := &Thumbnailer{
		img: imgageStroe,
	}

	if cacheLog != "" {
		t.cacheLoc = cacheLog
	}

	return t
}

func (t *Thumbnailer) GetThumbnail(fileName string, width, height int) (io.ReadCloser, int, error) {
	imgPath := path.Join(t.cacheLoc, fileName)

	imgReader, size, err := t.getFromCache(imgPath, width, height)
	if err != nil {
		if !os.IsNotExist(err) {
			return nil, 0, err
		}
	} else {
		return imgReader, size, nil
	}

	decoder, err := t.getDecoder(imgPath)
	if err != nil {
		return nil, 0, err
	}

	imgReader, err = t.img.GetReader(fileName)
	defer imgReader.Close()
	if err != nil {
		return nil, 0, err
	}

	imgData, err := decoder(imgReader)
	if err != nil {
		return nil, 0, err
	}

	tnData := resize.Thumbnail(uint(width), uint(height), imgData, resize.Lanczos3)
	var tnBufferBytes []byte
	tnBuffer := bytes.NewBuffer(tnBufferBytes)
	err = jpeg.Encode(tnBuffer, tnData, &jpeg.Options{
		Quality: 90,
	})
	if err != nil {
		return nil, 0, err
	}

	if err = t.saveToCache(imgPath, tnBuffer.Bytes(), width, height); err != nil {
		return nil, 0, err
	}

	return ioutil.NopCloser(tnBuffer), tnBuffer.Len(), nil
}

func (t *Thumbnailer) getFromCache(imgPath string, width, height int) (io.ReadCloser, int, error) {
	if t.cacheLoc == "" {
		return nil, 0, os.ErrNotExist
	}

	imgPath = fmt.Sprintf("%s_%d_%d.jpg", imgPath, width, height)
	stat, err := os.Stat(imgPath)
	if err != nil {
		return nil, 0, err
	}

	f, err := os.Open(imgPath)
	return f, int(stat.Size()), err
}

func (t *Thumbnailer) saveToCache(imgPath string, imgData []byte, width, height int) error {
	if t.cacheLoc == "" {
		return nil
	}

	imgPath = fmt.Sprintf("%s_%d_%d.jpg", imgPath, width, height)

	dir := path.Dir(imgPath)
	if _, err := os.Stat(dir); err != nil {
		if err = os.MkdirAll(dir, os.ModeDir); err != nil {
			return err
		}
	}

	f, err := os.Create(imgPath)
	if err != nil {
		return err
	}
	defer f.Close()

	_, err = f.Write(imgData)
	return err
}

func (t *Thumbnailer) getDecoder(path string) (imageDecoder, error) {
	ext := util.GetExtension(path)

	switch ext {
	case "jpg", "jpeg", "jfif":
		return jpeg.Decode, nil
	case "png":
		return png.Decode, nil
	case "gif":
		return gif.Decode, nil
	case "bmp":
		return bmp.Decode, nil
	case "tiff":
		return tiff.Decode, nil
	default:
		return nil, fmt.Errorf("unsupported format")
	}
}
