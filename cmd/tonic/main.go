package main

import (
	"log"

	"github.com/zekroTJA/tonic/internal/api"
	"github.com/zekroTJA/tonic/internal/config"
	"github.com/zekroTJA/tonic/internal/imgstore"
)

func main() {
	cfg, err := config.New("TONIC")
	if err != nil {
		log.Fatal(err)
	}

	img := imgstore.NewFSImageStore(cfg.ImageLocation)

	r, err := api.New(cfg, img)
	if err != nil {
		log.Fatal(err)
	}

	log.Fatal(r.Run())
}
