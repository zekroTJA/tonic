package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/zekroTJA/tonic/internal/hashing"
)

var (
	fCost   = flag.Int("cost", hashing.DefaultCost, "hashing cost")
	fSilent = flag.Bool("silent", false, "only print hash on success")
)

func main() {
	flag.Parse()

	password := flag.Arg(0)
	if password == "" {
		fmt.Println("Usage: hasher <password> [-cost] [-silent] [-h]")
		os.Exit(1)
	}

	hash, err := hashing.GetHash(password, *fCost)
	if err != nil {
		fmt.Println("Error: ", err.Error())
		os.Exit(1)
	}

	if !*fSilent {
		fmt.Printf("Generated hash with cost %d:\n", *fCost)
	}

	fmt.Println(hash)
}
