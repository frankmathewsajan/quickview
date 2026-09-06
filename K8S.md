# Kubernetes Setup & Deployment Guide

This guide walks through creating a local Kubernetes cluster from scratch, building the container images, deploying the Todo application, and accessing it.

No cloud account is required. Everything runs locally on your machine.

---

## Step 1: Create a Local Kubernetes Cluster

Choose one of the following methods to create a local cluster:

### Option A: Docker Desktop (Recommended / Easiest)
If you already have Docker Desktop installed:
1. Open **Docker Desktop Settings** (gear icon in the top right).
2. Click on the **Kubernetes** tab on the left menu.
3. Check the box **Enable Kubernetes**.
4. Click **Apply & restart**.
5. Wait 2 to 3 minutes until the Kubernetes icon in the bottom left turns green.

### Option B: Minikube
If you prefer Minikube:
1. Install Minikube:
   ```powershell
   winget install Kubernetes.minikube
   ```
2. Start the cluster:
   ```powershell
   minikube start
   ```

### Option C: Kind (Kubernetes in Docker)
If you prefer Kind:
1. Install Kind:
   ```powershell
   winget install Kubernetes.kind
   ```
2. Create a cluster:
   ```powershell
   kind create cluster --name todo-cluster
   ```

---

## Step 2: Verify the Cluster is Running

Check that your cluster is responsive and that your node is in the `Ready` state:

```powershell
kubectl cluster-info
kubectl get nodes
```

Expected output:
```text
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   1m    v1.34.1
```

---

## Step 3: Build the Container Images

Kubernetes runs your containers using Docker images. Build the backend and frontend images from the project root:

```powershell
docker build -t todo-backend:latest ./backend
docker build -t todo-frontend:latest ./frontend
```

### Note for Minikube or Kind users:
- **Docker Desktop**: Built images are immediately available to the local cluster.
- **Minikube**: Run `minikube image load todo-backend:latest` and `minikube image load todo-frontend:latest`.
- **Kind**: Run `kind load docker-image todo-backend:latest --name todo-cluster` and `kind load docker-image todo-frontend:latest --name todo-cluster`.

---

## Step 4: Deploy the Application

Apply the manifests inside the `k8s/` folder:

```powershell
kubectl apply -f k8s/
```

This creates:
- `Deployment` and `Service` for the FastAPI backend.
- `Deployment` and `Service` for the static frontend.

---

## Step 5: Verify Deployment Status

Check that the pods are running:

```powershell
kubectl get pods
```

Expected output:
```text
NAME                             READY   STATUS    RESTARTS   AGE
todo-backend-xxxxxxxxxx-xxxxx    1/1     Running   0          30s
todo-frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
```

Check the services:

```powershell
kubectl get services
```

---

## Step 6: Access the Application

Use `kubectl port-forward` to map the cluster services to your local machine:

**Terminal 1 (Backend):**
```powershell
kubectl port-forward svc/todo-backend 8000:8000
```

**Terminal 2 (Frontend):**
```powershell
kubectl port-forward svc/todo-frontend 3000:80
```

Now open your browser:
- **Frontend UI**: [http://localhost:3000](http://localhost:3000)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Step 7: Useful Commands for Debugging

If a pod does not start or shows an error:

1. **View pod logs:**
   ```powershell
   kubectl logs -l app=todo-backend
   kubectl logs -l app=todo-frontend
   ```

2. **Inspect events and failures:**
   ```powershell
   kubectl describe pod -l app=todo-backend
   ```

3. **Restart a deployment:**
   ```powershell
   kubectl rollout restart deployment todo-backend
   ```

---

## Step 8: Clean Up

To remove the deployed application from your cluster:

```powershell
kubectl delete -f k8s/
```

To stop or delete the cluster:
- **Docker Desktop**: Go to Settings ➜ Kubernetes ➜ uncheck "Enable Kubernetes" ➜ Apply & restart.
- **Minikube**: `minikube stop` or `minikube delete`.
- **Kind**: `kind delete cluster --name todo-cluster`.
