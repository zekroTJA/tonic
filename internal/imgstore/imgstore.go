package imgstore

import "io"

type ImageStore interface {
	List(offset, n int) ([]*Image, error)
	Get(name string) (*Image, error)
	GetReader(name string) (io.ReadCloser, error)
	Rename(name, newName string) error
	Delete(name string) error
}
