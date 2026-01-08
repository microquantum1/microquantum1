# 🚀 Deployment & Publishing Guide

Your TechVision website Docker image is ready to publish!

## Image Details
- **Image Name:** techvision-website
- **Tag:** latest
- **Size:** ~132MB
- **Base Image:** node:18-alpine

## Option 1: Publish to Docker Hub (Recommended)

### Step 1: Create Docker Hub Account
1. Go to [Docker Hub](https://hub.docker.com)
2. Sign up for a free account
3. Create a repository named `techvision-website`

### Step 2: Login to Docker
```bash
docker login
# Enter your Docker Hub username and password
```

### Step 3: Tag Your Image
Replace `YOUR_DOCKER_USERNAME` with your actual Docker Hub username:
```bash
docker tag techvision-website:latest YOUR_DOCKER_USERNAME/techvision-website:latest
docker tag techvision-website:latest YOUR_DOCKER_USERNAME/techvision-website:1.0.0
```

### Step 4: Push to Docker Hub
```bash
docker push YOUR_DOCKER_USERNAME/techvision-website:latest
docker push YOUR_DOCKER_USERNAME/techvision-website:1.0.0
```

## Option 2: Publish to GitHub Container Registry (GHCR)

### Step 1: Create Personal Access Token
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Create a token with `write:packages` scope
3. Copy your token

### Step 2: Login to GHCR
```bash
echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

### Step 3: Tag Your Image
```bash
docker tag techvision-website:latest ghcr.io/YOUR_USERNAME/techvision-website:latest
docker tag techvision-website:latest ghcr.io/YOUR_USERNAME/techvision-website:1.0.0
```

### Step 4: Push to GHCR
```bash
docker push ghcr.io/YOUR_USERNAME/techvision-website:latest
docker push ghcr.io/YOUR_USERNAME/techvision-website:1.0.0
```

## Option 3: Deploy to AWS ECR

### Step 1: Create ECR Repository
```bash
aws ecr create-repository --repository-name techvision-website --region us-east-1
```

### Step 2: Login to ECR
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
```

### Step 3: Tag and Push
```bash
docker tag techvision-website:latest YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/techvision-website:latest
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/techvision-website:latest
```

## Option 4: Deploy to Other Platforms

### Heroku
```bash
heroku container:login
heroku create your-app-name
heroku container:push web -a your-app-name
heroku container:release web -a your-app-name
```

### DigitalOcean
```bash
doctl registry create techvision-registry
doctl registry login
docker tag techvision-website:latest registry.digitalocean.com/techvision-registry/techvision-website:latest
docker push registry.digitalocean.com/techvision-registry/techvision-website:latest
```

## Running from Published Image

Once published, anyone can run your website with:
```bash
docker run -p 3000:3000 YOUR_USERNAME/techvision-website:latest
```

Then access it at: http://localhost:3000

## Docker Compose from Registry

Update your `docker-compose.yml` to use the published image:
```yaml
version: '3.8'

services:
  web:
    image: YOUR_USERNAME/techvision-website:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

Then run:
```bash
docker-compose up
```

## Image Size Optimization (Optional)

To reduce the image size further, create a `.dockerignore`:
```
node_modules
npm-debug.log
.git
.gitignore
README.md
.DS_Store
.env
dist
build
```

Then rebuild:
```bash
docker build -t techvision-website:latest .
```

## Versioning Best Practices

Use semantic versioning for releases:
```bash
docker tag techvision-website:latest YOUR_USERNAME/techvision-website:1.0.0
docker tag techvision-website:latest YOUR_USERNAME/techvision-website:1.0
docker tag techvision-website:latest YOUR_USERNAME/techvision-website:latest

docker push YOUR_USERNAME/techvision-website:1.0.0
docker push YOUR_USERNAME/techvision-website:1.0
docker push YOUR_USERNAME/techvision-website:latest
```

## Updating Your Image

When you make changes:
1. Update your code
2. Rebuild the image: `docker build -t techvision-website:latest .`
3. Tag with new version: `docker tag techvision-website:latest YOUR_USERNAME/techvision-website:1.1.0`
4. Push: `docker push YOUR_USERNAME/techvision-website:1.1.0`

## Monitoring & Logs

Check your running container:
```bash
docker ps
docker logs CONTAINER_ID
docker stats CONTAINER_ID
```

## Health Check

Your application is healthy when the server responds:
```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"OK","timestamp":"2026-01-08T..."}`

---

**Ready to publish? Choose your platform and follow the steps above!** 🎉
