.PHONY: cover

BIN_PATH:=node_modules/.bin/

all:	digibytejs-wallet-client.min.js

clean:
	rm digibytejs-wallet-client.js
	rm digibytejs-wallet-client.min.js

digibytejs-wallet-client.js: index.js lib/*.js
	${BIN_PATH}browserify $< > $@

digibytejs-wallet-client.min.js: digibytejs-wallet-client.js
	uglify  -s $<  -o $@

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- --reporter spec test
