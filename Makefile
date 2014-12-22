build:
	node_modules/.bin/xpkg .
	node_modules/.bin/browserify -e ./index.js -o dist/cyclic.js -s cyclic
	node_modules/.bin/uglifyjs < dist/cyclic.js > dist/cyclic.min.js --comments license

test:
	node_modules/.bin/qunit -c cyclic:./index.js -t ./test/index.js --cov

.PHONY: build test
