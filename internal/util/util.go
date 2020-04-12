package util

import (
	"fmt"
	"mime"
	"strings"
)

func GetExtension(fileName string) string {
	iExt := strings.LastIndex(fileName, ".")
	if iExt < 0 {
		return ""
	}

	return fileName[iExt+1:]
}

func GetMimeType(name string) string {
	return mime.TypeByExtension(fmt.Sprintf(".%s", GetExtension(name)))
}
