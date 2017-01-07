#!/usr/bin/env bash

rm -rf ./tests/a && ./index.js unpack ./tests/s.js ./tests/a sm && webpack ./tests/a/index ./tests/bundle.js
