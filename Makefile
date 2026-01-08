.PHONY: help build push build-push login test clean local-run docker-run

# Default target
help:
	@echo "=========================================="
	@echo "TechVision Website - Build Automation"
	@echo "=========================================="
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  make help           - Show this help message"
	@echo "  make build          - Build Docker image locally"
	@echo "  make push           - Push image to Docker Hub"
	@echo "  make build-push     - Build and push (full automation)"
	@echo "  make login          - Login to Docker Hub"
	@echo "  make local-run      - Run locally without Docker"
	@echo "  make docker-run     - Run Docker container"
	@echo "  make test           - Test the application"
	@echo "  make clean          - Clean up images and containers"
	@echo ""
	@echo "Examples:"
	@echo "  make build"
	@echo "  make build-push"
	@echo "  make docker-run"
	@echo ""

# Variables
DOCKER_USERNAME ?= glowingjellyfish
IMAGE_NAME := techvision-website
IMAGE_TAG := latest
VERSION := $(shell date +%s)

# Build Docker image
build:
	@echo "🔨 Building Docker image..."
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .
	docker tag $(IMAGE_NAME):$(IMAGE_TAG) $(DOCKER_USERNAME)/$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "✓ Image built successfully"

# Login to Docker Hub
login:
	@echo "🔐 Logging in to Docker Hub..."
	docker login

# Push to Docker Hub
push: login
	@echo "📤 Pushing image to Docker Hub..."
	docker push $(DOCKER_USERNAME)/$(IMAGE_NAME):$(IMAGE_TAG)
	docker push $(DOCKER_USERNAME)/$(IMAGE_NAME):$(VERSION)
	@echo "✓ Image pushed successfully"

# Build and push (full automation)
build-push: build push
	@echo "✅ Build and push complete!"
	@echo ""
	@echo "Pull command:"
	@echo "  docker pull $(DOCKER_USERNAME)/$(IMAGE_NAME):latest"
	@echo ""
	@echo "Run command:"
	@echo "  docker run -p 3000:3000 $(DOCKER_USERNAME)/$(IMAGE_NAME):latest"

# Run locally without Docker
local-run:
	@echo "🚀 Starting local server..."
	npm install
	npm start

# Run Docker container
docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 3000:3000 $(DOCKER_USERNAME)/$(IMAGE_NAME):$(IMAGE_TAG)

# Test the application
test:
	@echo "🧪 Running tests..."
	@echo "Testing API endpoints..."
	@curl -s http://localhost:3000/api/health | jq . || echo "Server not running"
	@echo "✓ Tests complete"

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	docker rmi $(DOCKER_USERNAME)/$(IMAGE_NAME):$(IMAGE_TAG) || true
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) || true
	docker system prune -f
	@echo "✓ Cleanup complete"

# View logs
logs:
	docker logs $$(docker ps | grep $(IMAGE_NAME) | awk '{print $$1}') -f

# Stop container
stop:
	docker stop $$(docker ps | grep $(IMAGE_NAME) | awk '{print $$1}') || true
	@echo "✓ Container stopped"

# Status
status:
	@echo "Docker status:"
	docker ps | grep $(IMAGE_NAME) || echo "No running containers"
	@echo ""
	@echo "Image status:"
	docker images | grep $(IMAGE_NAME) || echo "No images found"
