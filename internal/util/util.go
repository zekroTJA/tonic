package util

import "strings"

func GetExtension(fileName string) string {
	iExt := strings.LastIndex(fileName, ".")
	if iExt < 0 {
		return ""
	}

	return fileName[iExt+1:]
}
