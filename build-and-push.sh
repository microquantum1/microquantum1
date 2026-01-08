#!/bin/bash

# TechVision Website - Automated Build & Push Script
# This script builds your Docker image and pushes it to Docker Hub

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOCKER_USERNAME="${DOCKER_USERNAME:-glowingjellyfish}"
IMAGE_NAME="techvision-website"
REGISTRY="docker.io"

# Functions
print_header() {
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Docker is installed
check_docker() {
  print_info "Checking Docker installation..."
  if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed"
    exit 1
  fi
  print_success "Docker found"
}

# Check if user is logged in
check_login() {
  print_info "Checking Docker Hub authentication..."
  if ! docker info > /dev/null 2>&1; then
    print_error "Not logged in to Docker Hub"
    print_info "Running: docker login"
    docker login
  fi
  print_success "Authenticated"
}

# Get version/tag
get_version() {
  if [ -z "$VERSION" ]; then
    VERSION=$(date +%s)  # Use timestamp as fallback
  fi
  print_info "Building version: $VERSION"
}

# Build Docker image
build_image() {
  print_header "Building Docker Image"
  print_info "Image: $IMAGE_NAME:$VERSION"
  
  if docker build -t $IMAGE_NAME:latest -t $IMAGE_NAME:$VERSION .; then
    print_success "Image built successfully"
  else
    print_error "Failed to build image"
    exit 1
  fi
}

# Tag image
tag_image() {
  print_header "Tagging Image"
  
  FULL_TAG_LATEST="$DOCKER_USERNAME/$IMAGE_NAME:latest"
  FULL_TAG_VERSION="$DOCKER_USERNAME/$IMAGE_NAME:$VERSION"
  
  print_info "Tagging: $FULL_TAG_LATEST"
  docker tag $IMAGE_NAME:latest $FULL_TAG_LATEST
  
  print_info "Tagging: $FULL_TAG_VERSION"
  docker tag $IMAGE_NAME:$VERSION $FULL_TAG_VERSION
  
  print_success "Images tagged successfully"
}

# Push to Docker Hub
push_image() {
  print_header "Pushing to Docker Hub"
  
  print_info "Pushing: $FULL_TAG_LATEST"
  if docker push $FULL_TAG_LATEST; then
    print_success "Pushed $FULL_TAG_LATEST"
  else
    print_error "Failed to push $FULL_TAG_LATEST"
    exit 1
  fi
  
  print_info "Pushing: $FULL_TAG_VERSION"
  if docker push $FULL_TAG_VERSION; then
    print_success "Pushed $FULL_TAG_VERSION"
  else
    print_error "Failed to push $FULL_TAG_VERSION"
    exit 1
  fi
}

# Show image info
show_info() {
  print_header "Image Information"
  echo -e "Docker Username: ${YELLOW}$DOCKER_USERNAME${NC}"
  echo -e "Image Name: ${YELLOW}$IMAGE_NAME${NC}"
  echo -e "Version: ${YELLOW}$VERSION${NC}"
  echo -e "Registry: ${YELLOW}$REGISTRY${NC}"
  echo ""
  echo -e "Pull Commands:"
  echo -e "${GREEN}docker pull $DOCKER_USERNAME/$IMAGE_NAME:latest${NC}"
  echo -e "${GREEN}docker pull $DOCKER_USERNAME/$IMAGE_NAME:$VERSION${NC}"
  echo ""
  echo -e "Run Command:"
  echo -e "${GREEN}docker run -p 3000:3000 $DOCKER_USERNAME/$IMAGE_NAME:latest${NC}"
}

# Main execution
main() {
  print_header "🚀 TechVision Website - Build & Push Automation"
  
  # Check prerequisites
  check_docker
  check_login
  
  # Get version
  get_version
  
  # Build and push
  build_image
  tag_image
  push_image
  
  # Show results
  show_info
  
  print_header "✅ Build and Push Complete!"
}

# Run main function
main "$@"
