#!/bin/bash

# SPDX-FileCopyrightText: 2026 caixw
#
# SPDX-License-Identifier: MIT

openssl req -newkey rsa:2048 -x509 -nodes -keyout key.pem -new -out cert.pem -config req.cnf -sha256 -days 3650
