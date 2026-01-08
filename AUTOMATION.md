# 🤖 Automation Guide

This project includes multiple automation options to build and push your Docker image. Choose the method that works best for you!

## Option 1: Shell Script (Recommended for Local Development)

The easiest way to build and push your image locally.

### Usage
```bash
# Run with default settings
./build-and-push.sh

# Or with custom version
VERSION=1.1.0 ./build-and-push.sh

# Or with custom Docker username
DOCKER_USERNAME=yourname ./build-and-push.sh
```

### What It Does
✓ Checks Docker installation  
✓ Authenticates with Docker Hub  
✓ Builds the image  
✓ Tags with latest and version  
✓ Pushes to Docker Hub  
✓ Displays pull/run commands  

### Example Output
```
========================================
🚀 TechVision Website - Build & Push Automation
========================================
ℹ Checking Docker installation...
✓ Docker found
ℹ Building version: 1234567890
✓ Image built successfully
✓ Images tagged successfully
✓ Pushed glowingjellyfish/techvision-website:latest
✓ Pushed glowingjellyfish/techvision-website:1234567890

Pull: docker pull glowingjellyfish/techvision-website:latest
Run: docker run -p 3000:3000 glowingjellyfish/techvision-website:latest
```

---

## Option 2: Makefile (Recommended for Teams)

Simple make commands for common tasks.

### Available Commands
```bash
make build              # Build Docker image
make push               # Push to Docker Hub
make build-push        # Build and push (full automation)
make login             # Login to Docker Hub
make local-run         # Run locally without Docker
make docker-run        # Run Docker container
make test              # Test the application
make clean             # Clean up images
make logs              # View container logs
make stop              # Stop running container
make status            # Show container/image status
make help              # Show this help message
```

### Usage Examples
```bash
# Build locally
make build

# Full automation (build + push)
make build-push

# Run with Docker
make docker-run

# View status
make status

# Clean up
make clean
```

### With Custom Values
```bash
# Build with custom username
make build DOCKER_USERNAME=yourname

# Build with custom version
make build-push VERSION=2.0.0

# Push with custom tag
make push IMAGE_TAG=production
```

---

## Option 3: GitHub Actions (Recommended for CI/CD)

Automatic builds and pushes on git events (recommended for production).

### Setup Required

1. **Add Docker Hub Secrets to GitHub:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     - `DOCKER_USERNAME` - Your Docker Hub username
     - `DOCKER_PASSWORD` - Your Docker Hub access token

2. **GitHub Personal Access Token:**
   - Go to Docker Hub: Account Settings → Security
   - Create a "New Access Token"
   - Use this as your `DOCKER_PASSWORD` secret

### Triggers

The workflow automatically runs on:
- ✓ Push to `main` branch → builds with `latest` tag
- ✓ Push to `develop` branch → builds with `develop` tag
- ✓ Tag pushes (e.g., `v1.0.0`) → builds semantic version tags
- ✓ Manual trigger via GitHub UI

### Example: Trigger Manually
1. Go to GitHub repository
2. Actions tab
3. Select "Build & Push Docker Image"
4. Click "Run workflow"

### Automatic Tags
- `latest` - On push to main branch
- `develop` - On push to develop branch
- `v1.0.0` - On tag push
- `sha-abc123def` - Git SHA commit hash
- Branch name - On push to any branch

### View Workflow Status
- Go to Actions tab in GitHub
- See all workflow runs
- Check logs for each build

---

## Option 4: Combined Approach (Recommended for Production)

Use both local script for testing and GitHub Actions for production:

### Development Workflow
```bash
# Local testing
./build-and-push.sh

# Or use make
make build-push
```

### Production Workflow
1. Commit and push to main branch
2. GitHub Actions automatically builds and pushes
3. View results in Actions tab
4. Create release tags for version releases

---

## Quick Start Guide

### For Local Development (One-Time Setup)
```bash
# 1. Login to Docker Hub
docker login

# 2. Build and push
./build-and-push.sh

# Or use make
make build-push
```

### For CI/CD Automation (GitHub)
```bash
# 1. Add GitHub secrets (see Option 3)
# 2. Push to main branch
git add .
git commit -m "Initial commit"
git push origin main

# 3. GitHub Actions automatically builds and pushes
# 4. Check Actions tab for status
```

### For Team Collaboration
```bash
# Use make commands (easier for everyone)
make build-push
make docker-run
make status
make clean
```

---

## Troubleshooting

### Issue: "Permission denied" when running script
```bash
chmod +x build-and-push.sh
./build-and-push.sh
```

### Issue: "Not logged in to Docker Hub"
```bash
docker login
```

### Issue: "Failed to push image"
- Verify `DOCKER_USERNAME` is correct
- Check Docker Hub repository exists
- Verify Docker Hub credentials

### Issue: GitHub Actions not running
- Check secrets are added (Settings → Secrets)
- Check workflow file is in `.github/workflows/`
- Verify branch name matches trigger (main/develop)

---

## Environment Variables

### Shell Script
```bash
DOCKER_USERNAME    - Docker Hub username (default: glowingjellyfish)
VERSION            - Image version/tag (default: timestamp)
```

### Makefile
```bash
DOCKER_USERNAME    - Docker Hub username (default: glowingjellyfish)
IMAGE_NAME         - Image name (default: techvision-website)
IMAGE_TAG          - Image tag (default: latest)
VERSION            - Version tag (default: timestamp)
```

### GitHub Actions (in docker-build.yml)
```yaml
DOCKER_USERNAME    - From secrets (required)
DOCKER_PASSWORD    - From secrets (required)
```

---

## Image Publishing Locations

After automation runs, your image is available at:

**Docker Hub:**
```
docker.io/glowingjellyfish/techvision-website:latest
docker.io/glowingjellyfish/techvision-website:1.0.0
```

**Pull & Run:**
```bash
docker pull glowingjellyfish/techvision-website:latest
docker run -p 3000:3000 glowingjellyfish/techvision-website:latest
```

---

## Recommended Workflow

### Development
```bash
# Make changes to code
nano public/script.js

# Test locally
make local-run

# Build Docker image
make build

# Push to Docker Hub
make push
```

### Production
```bash
# Commit changes
git add .
git commit -m "Add new features"

# Create version tag
git tag -a v1.1.0 -m "Version 1.1.0"

# Push to GitHub
git push origin main --tags

# GitHub Actions automatically:
# 1. Builds image
# 2. Tags as v1.1.0
# 3. Pushes to Docker Hub
# 4. Updates Docker Hub description
```

---

## Next Steps

1. ✅ Image built and pushed to Docker Hub
2. ✅ Local automation ready (shell script)
3. ✅ Makefile commands available
4. ⏭️ **Setup GitHub Actions** - Add secrets to GitHub repo
5. ⏭️ **Create releases** - Tag commits for automatic builds

**Happy automating!** 🚀
