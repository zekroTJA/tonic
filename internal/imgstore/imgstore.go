package imgstore

import "io"

type ImageStore interface {
	List(offset, n int) ([]*Image, error)
	Get(name string) (*Image, error)
	GetReader(name string) (io.Reader, error)
	Rename(name, newName string) error
	Delete(name string) error
}
