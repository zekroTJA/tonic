package imgstore

import (
	"io"
	"io/ioutil"
	"os"
	"path"
	"regexp"
)

var imgRx = regexp.MustCompile(`^.+\.(jpe?g|png|gif|bmp|tiff|ico|bpg)$`)

type FSImageStore struct {
	location string
}

func NewFSImageStore(location string) *FSImageStore {
	return &FSImageStore{
		location: location,
	}
}

func (f *FSImageStore) List() ([]*Image, error) {
	files, err := ioutil.ReadDir(f.location)
	if err != nil {
		return nil, err
	}

	images := make([]*Image, len(files))
	i := 0
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		name := file.Name()
		if !imgRx.MatchString(name) {
			continue
		}

		img := &Image{
			Location: path.Join(f.location, name),
			Date:     file.ModTime(),
			Name:     name,
			Size:     file.Size(),
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

	img := &Image{
		Location: filePath,
		Date:     file.ModTime(),
		Name:     file.Name(),
		Size:     file.Size(),
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
