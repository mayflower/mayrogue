JSHINT = ./node_modules/jshint/bin/jshint
JSHINT_CONFIG_FRONTEND = ./jshintrc_frontend

JSHINT_FRONTEND_SRC = \
	./frontend_prototype/script/main.js \
	./frontend_prototype/script/dispatch.js \
	./frontend_prototype/script/geometry.js \
	./frontend_prototype/script/tilesets.js \
	./frontend_prototype/script/tiles.js \
	./frontend_prototype/script/ui.js \
	./frontend_prototype/script/util.js \
	./frontend_prototype/script/world.js \
	./frontend_prototype/script/tilesets/oryx.js

include Makefile.local

all: jshint

jshint: $(JSHINT_FRONTEND_SRC)
	$(JSHINT) --config $(JSHINT_CONFIG_FRONTEND) $^

Makefile.local:
	touch $@
