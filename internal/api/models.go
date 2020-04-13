package api

type listWrapper struct {
	Count  int         `json:"count"`
	Offset int         `json:"offset"`
	Data   interface{} `json:"data"`
}

type loginModel struct {
	Password string `json:"password"`
}
