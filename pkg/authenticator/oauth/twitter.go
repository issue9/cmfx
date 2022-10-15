// SPDX-License-Identifier: MIT

package oauth

import (
	"encoding/json"
	"io"
	"net/http"

	"golang.org/x/oauth2"
)

const (
	TwitterAuthURL  = "https://api.twitter.com/2/oauth2/authorize"
	TwitterTokenURL = "https://api.twitter.com/2/oauth2/token"
)

var TwitterScopes = []string{"tweet.read", "users.read"}

type TwitterUserInfo struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

func (info *TwitterUserInfo) Identity() string { return info.ID }

func TwitterGetUserInfo(token *oauth2.Token) (*TwitterUserInfo, error) {
	const getUserInfoURL = "https://api.twitter.com/2/users/me"

	req, err := http.NewRequest(http.MethodGet, getUserInfoURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", token.AccessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	info := &TwitterUserInfo{}
	if err := json.Unmarshal(data, info); err != nil {
		return nil, err
	}
	return info, nil
}
