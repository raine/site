all: build

clean:
	rm -rf public/

build:
	stasis

# dist: clean init build
# 
# publish: dist
# 	npm publish
