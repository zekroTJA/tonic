package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	"github.com/zekroTJA/tonic/internal/hashing"
)

var (
	fCost   = flag.Int("c", hashing.DefaultCost, "hashing cost")
	fSilent = flag.Bool("s", false, "only print hash string")
	fEscape = flag.Bool("e", false, "escape output for docker compose")
)

func main() {
	flag.Parse()

	password := flag.Arg(0)
	if password == "" {
		fmt.Println("Usage: hasher <password> [-c] [-e] [-h] [-s]")
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

	if *fEscape {
		fmt.Println(escape(hash))
	} else {
		fmt.Println(hash)
	}
}

func escape(v string) string {
	return strings.ReplaceAll(v, "$", "$$")
}
