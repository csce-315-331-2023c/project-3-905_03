# Define variables
FRONT_DIR = front
BACK_DIR = back

# Build targets
all: install-front build-front install-back run-back
quick: build-front run-back


install-front:
	@echo "Installing front dependencies..."
	cd $(FRONT_DIR) && npm install

build-front: 
	@echo "Building front..."
	cd $(FRONT_DIR) && npx vite build

install-back:
	@echo "Installing back dependencies..."
	cd $(BACK_DIR) && npm install

run-back: 
	@echo "Running back..."
	cd $(BACK_DIR) && node index.js

start: 
	@echo "Installing Root Dependencies..."
	npm install -g concurrently
	@echo "Installing Front Dependencies..."
	cd $(FRONT_DIR) && npm install && npm run dev &
	@echo "Installing Back Dependencies..."
	cd $(BACK_DIR) && npm install && node index.js

.PHONY: all install-front build-front install-back run-back

