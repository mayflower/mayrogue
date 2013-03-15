JSHINT = ./node_modules/jshint/bin/jshint
JSHINT_CONFIG_FRONTEND = ./jshintrc_frontend

JSHINT_FRONTEND_SRC = \
	./frontend/main.js \
	./frontend/dispatch.js \
	./scripts/geometry.js \
	./scripts/tilesets.js \
	./scripts/tiles.js \
	./scripts/ui.js \
	./scripts/util.js \
	./scripts/world.js \
	./frontend/tilesets/oryx.js

include Makefile.local

all: jshint

jshint: $(JSHINT_FRONTEND_SRC)
	$(JSHINT) --config $(JSHINT_CONFIG_FRONTEND) $^

Makefile.local:
	touch $@
