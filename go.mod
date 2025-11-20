module github.com/issue9/cmfx

go 1.25.0

ignore (
	./apps/admin
	./apps/docs

	./build/vite-plugin-about
	./build/vite-plugin-api

	./coverage
	./docs
	./node_modules

	./packages
	./scripts
)

require (
	github.com/fxamacker/cbor/v2 v2.9.0
	github.com/go-webauthn/webauthn v0.13.4
	github.com/goccy/go-yaml v1.18.0
	github.com/issue9/assert/v4 v4.3.1
	github.com/issue9/cache v0.19.4
	github.com/issue9/config v0.9.3
	github.com/issue9/conv v1.3.6
	github.com/issue9/errwrap v0.3.3
	github.com/issue9/events v0.9.2
	github.com/issue9/logs/v7 v7.6.8
	github.com/issue9/mux/v9 v9.2.1
	github.com/issue9/orm/v6 v6.0.0-beta.4
	github.com/issue9/rands/v3 v3.1.0
	github.com/issue9/scheduled v0.22.3
	github.com/issue9/sliceutil v0.17.0
	github.com/issue9/upload/v4 v4.0.0
	github.com/issue9/web v0.104.2
	github.com/issue9/webuse/v7 v7.0.0-20250910131547-e30b2226a300
	github.com/kardianos/service v1.2.4
	github.com/mattn/go-sqlite3 v1.14.32
	github.com/shirou/gopsutil/v4 v4.25.8
	golang.org/x/crypto v0.45.0
	golang.org/x/text v0.31.0
)

require (
	filippo.io/edwards25519 v1.1.0 // indirect
	github.com/BurntSushi/toml v1.5.0 // indirect
	github.com/andybalholm/brotli v1.2.0 // indirect
	github.com/bradfitz/gomemcache v0.0.0-20250403215159-8d39553ac7cf // indirect
	github.com/cespare/xxhash/v2 v2.3.0 // indirect
	github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f // indirect
	github.com/ebitengine/purego v0.8.4 // indirect
	github.com/go-ole/go-ole v1.3.0 // indirect
	github.com/go-sql-driver/mysql v1.9.3 // indirect
	github.com/go-webauthn/x v0.1.23 // indirect
	github.com/golang-jwt/jwt/v5 v5.3.0 // indirect
	github.com/google/go-tpm v0.9.5 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/issue9/localeutil v0.31.0 // indirect
	github.com/issue9/query/v3 v3.1.4 // indirect
	github.com/issue9/source v0.12.6 // indirect
	github.com/issue9/term/v3 v3.4.3 // indirect
	github.com/issue9/unique/v2 v2.1.1 // indirect
	github.com/issue9/version v1.0.9 // indirect
	github.com/issue9/watermark v1.2.5 // indirect
	github.com/jellydator/ttlcache/v3 v3.4.0 // indirect
	github.com/klauspost/compress v1.18.0 // indirect
	github.com/lib/pq v1.10.9 // indirect
	github.com/lufia/plan9stats v0.0.0-20250827001030-24949be3fa54 // indirect
	github.com/mitchellh/mapstructure v1.5.0 // indirect
	github.com/power-devops/perfstat v0.0.0-20240221224432-82ca36839d55 // indirect
	github.com/puzpuzpuz/xsync/v4 v4.1.0 // indirect
	github.com/redis/go-redis/v9 v9.13.0 // indirect
	github.com/shopspring/decimal v1.4.0 // indirect
	github.com/tklauser/go-sysconf v0.3.15 // indirect
	github.com/tklauser/numcpus v0.10.0 // indirect
	github.com/x448/float16 v0.8.4 // indirect
	github.com/yusufpapurcu/wmi v1.2.4 // indirect
	golang.org/x/mod v0.29.0 // indirect
	golang.org/x/net v0.47.0 // indirect
	golang.org/x/sync v0.18.0 // indirect
	golang.org/x/sys v0.38.0 // indirect
	golang.org/x/xerrors v0.0.0-20240903120638-7835f813f4da // indirect
)
