package hashing

import "golang.org/x/crypto/bcrypt"

const DefaultCost = 12

func GetHashB(v string, cost int) ([]byte, error) {
	return bcrypt.GenerateFromPassword(StrToBytes(v), cost)
}

func GetHash(v string, cost int) (string, error) {
	hashb, err := GetHashB(v, cost)
	if err != nil {
		return "", err
	}
	return BytesToStr(hashb), err
}

func CompareHashSafe(hash []byte, v string) bool {
	return bcrypt.CompareHashAndPassword(
		hash, StrToBytes(v)) == nil
}

func StrToBytes(v string) []byte {
	return []byte(v)
}

func BytesToStr(v []byte) string {
	return string(v)
}
