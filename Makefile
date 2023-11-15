# Define variables
FRONT_DIR = front
BACK_DIR = back

# Build targets
quick: build-front run-back
all: install-front build-front install-back run-back

install-front:
	@echo "Installing front dependencies..."
	cd $(FRONT_DIR) && npm install

build-front: install-front
	@echo "Building front..."
	cd $(FRONT_DIR) && vite build

install-back:
	@echo "Installing back dependencies..."
	cd $(BACK_DIR) && npm install

run-back: install-back
	@echo "Running back..."
	cd $(BACK_DIR) && node index.js

start: install-front install-back
	@echo "Starting front and back..."
	cd $(FRONT_DIR) && npm run dev &
	cd $(BACK_DIR) && node index.js

.PHONY: all install-front build-front install-back run-back