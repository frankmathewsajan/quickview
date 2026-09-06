# Kubernetes Setup (k8s)

This directory contains minimal Kubernetes manifests to run the Todo application on any Kubernetes cluster (such as Docker Desktop Kubernetes, Minikube, or kind).

For the full step-by-step walkthrough on creating a cluster and deploying, see [K8S.md](../K8S.md).

## Files

- `backend.yaml`: Deployment and ClusterIP Service for the FastAPI backend.
- `frontend.yaml`: Deployment and NodePort Service for the HTML/CSS/JS frontend.

---

## Step-by-Step Guide

### 1. Build Container Images
Before applying the manifests to Kubernetes, build the Docker images locally:
```powershell
docker build -t todo-backend:1.0.0 ./backend
docker build -t todo-frontend:1.0.0 ./frontend
```

### 2. Enable Kubernetes (if using Docker Desktop)
1. Open **Docker Desktop Settings**.
2. Go to **Kubernetes** tab.
3. Check **Enable Kubernetes** and click **Apply & restart**.

### 3. Deploy to Kubernetes
Using the downloaded `kubectl` (or system `kubectl`):
```powershell
.\kubectl.exe apply -f k8s/
```

### 4. Check Deployment Status
Verify that pods and services are running:
```powershell
.\kubectl.exe get pods
.\kubectl.exe get services
```

### 5. Access the Services
You can forward ports directly to your local machine:
```powershell
# Forward backend to port 8000
.\kubectl.exe port-forward svc/todo-backend 8000:8000

# Forward frontend to port 3000
.\kubectl.exe port-forward svc/todo-frontend 3000:80
```
Then visit [http://localhost:3000](http://localhost:3000).

### 6. Clean Up
To remove all deployed resources from the cluster:
```powershell
.\kubectl.exe delete -f k8s/
```
