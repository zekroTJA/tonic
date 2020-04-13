package imgstore

import (
	"io"
	"io/ioutil"
	"os"
	"path"
	"regexp"

	"github.com/zekroTJA/tonic/internal/util"
)

var imgRx = regexp.MustCompile(`^.+\.(jpe?g|png|gif|bmp|tiff|ico|bpg|jfif)$`)

type FSImageStore struct {
	location string
}

func NewFSImageStore(location string) *FSImageStore {
	return &FSImageStore{
		location: location,
	}
}

func (f *FSImageStore) List(offset, n int) ([]*Image, error) {
	files, err := ioutil.ReadDir(f.location)
	if err != nil {
		return nil, err
	}

	l := len(files)
	if n < 0 {
		n = len(files)
	}
	if offset+n >= l {
		n = l - offset
	}

	files = files[offset : offset+n]

	images := make([]*Image, len(files))
	i := 0
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		fileName := file.Name()
		if !imgRx.MatchString(fileName) {
			continue
		}

		img := &Image{
			Location: path.Join(f.location, fileName),
			Date:     file.ModTime(),
			Name:     fileName,
			Size:     file.Size(),
			MimeType: util.GetMimeType(fileName),
		}

		images[i] = img
		i++
	}

	return images[0:i], nil
}

func (f *FSImageStore) Get(name string) (*Image, error) {
	filePath := path.Join(f.location, name)

	file, err := os.Stat(filePath)
	if err != nil {
		return nil, err
	}

	fileName := file.Name()

	img := &Image{
		Location: filePath,
		Date:     file.ModTime(),
		Name:     fileName,
		Size:     file.Size(),
		MimeType: util.GetMimeType(fileName),
	}

	return img, nil
}

func (f *FSImageStore) GetReader(name string) (io.Reader, error) {
	return os.Open(path.Join(f.location, name))
}

func (f *FSImageStore) Rename(name, newName string) error {
	if name == newName {
		return nil
	}

	old := path.Join(f.location, name)
	new := path.Join(f.location, newName)
	return os.Rename(old, new)
}

func (f *FSImageStore) Delete(name string) error {
	return os.Remove(path.Join(f.location, name))
}
