package imgstore

import "time"

type Image struct {
	Name     string    `json:"name"`
	Location string    `json:"location"`
	Date     time.Time `json:"date"`
	Size     int64     `json:"size"`
}
