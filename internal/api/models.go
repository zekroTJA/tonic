package api

type listWrapper struct {
	Count int         `json:"count"`
	Page  int         `json:"page,omitempty"`
	Data  interface{} `json:"data"`
}

type loginModel struct {
	Password string `json:"password"`
}
