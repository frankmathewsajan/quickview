# Full-Stack Todo & DevOps Setup

A minimal full-stack application and DevOps sandbox with FastAPI, SQLite, vanilla HTML/CSS/JS frontend, Docker Compose, Jenkins, and Kubernetes.

## Repository Structure

```text
learningsomestuff/
├── backend/               # FastAPI backend (SQLite & uv)
│   ├── main.py            # CRUD API (~60 lines)
│   ├── pyproject.toml     # Python dependencies
│   ├── uv.lock            # Lockfile
│   └── Dockerfile         # Python container
│
├── frontend/              # Static frontend
│   ├── index.html         # UI layout
│   ├── style.css          # Styles
│   ├── app.js             # API calls
│   └── Dockerfile         # Nginx container
│
├── jenkins/               # Jenkins automation
│   ├── Dockerfile         # Jenkins LTS image
│   ├── docker-compose.yml # Standalone Jenkins compose
│   └── README.md          # Setup instructions
│
├── k8s/                   # Kubernetes manifests
│   ├── backend.yaml       # Backend Deployment & Service
│   ├── frontend.yaml      # Frontend Deployment & Service
│   └── README.md          # Kubernetes guide
│
├── docker-compose.yml     # Multi-container orchestration
├── Jenkinsfile            # Pipeline to build images & deploy to Kubernetes
├── K8S.md                 # Complete Kubernetes guide
└── README.md              # Project documentation
```

## Quickstart with Docker Compose

Make sure Docker Desktop is running, then run:

```bash
docker compose up --build
```

Access services at:

- Frontend: http://localhost:3000
- Backend Docs: http://localhost:8000/docs
- Jenkins: http://localhost:8080

To stop all services:

```bash
docker compose down
```

## Running Locally (Without Docker)

### Backend

```bash
cd backend
uv run uvicorn main:app --reload --port 8000
```

Backend runs at http://localhost:8000.

### Frontend

Open `frontend/index.html` directly in a browser, or run:

```bash
cd frontend
python -m http.server 3000
```

Frontend runs at http://localhost:3000.

## Jenkins Setup

Jenkins runs on port 8080 (UI) and 50000 (agents).

To get the initial administrator password:

```bash
docker exec -it learningsomestuff-jenkins-1 cat /var/jenkins_home/secrets/initialAdminPassword
```

To run Jenkins alone:

```bash
cd jenkins
docker compose up -d
```

## Kubernetes (k8s) Setup

### 1. Build Docker Images

```bash
docker build -t todo-backend:1.0.0 ./backend
docker build -t todo-frontend:1.0.0 ./frontend
```

### 2. Deploy Manifests

```bash
kubectl apply -f k8s/
```

### 3. Check Status

```bash
kubectl get pods
kubectl get services
```

### 4. Access via Port Forwarding

```bash
# Terminal 1: Backend
kubectl port-forward svc/todo-backend 8000:8000

# Terminal 2: Frontend
kubectl port-forward svc/todo-frontend 3000:80
```

Open http://localhost:3000 in your browser.

To delete resources:

```bash
kubectl delete -f k8s/
```

## API Endpoints

| Method | Endpoint | Request Body | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/todos` | None | Get all todos |
| `POST` | `/todos` | `{"title": "string"}` | Create a todo |
| `PUT` | `/todos/{id}` | `{"completed": boolean}` | Update completion status |
| `DELETE` | `/todos/{id}` | None | Delete a todo |

## Tech Stack

- Backend: Python 3.12+, FastAPI, Uvicorn, SQLite
- Package Manager: uv
- Frontend: HTML5, CSS3, JavaScript, Nginx
- Containers: Docker, Docker Compose
- CI/CD: Jenkins LTS
- Orchestration: Kubernetes
