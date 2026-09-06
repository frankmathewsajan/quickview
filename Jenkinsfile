pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                // Build container images for backend and frontend
                sh 'docker build -t todo-backend:latest ./backend'
                sh 'docker build -t todo-frontend:latest ./frontend'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Apply Kubernetes manifests
                sh 'kubectl apply -f k8s/'
            }
        }

        stage('Verify Deployment') {
            steps {
                // Check deployment rollout status
                sh 'kubectl rollout status deployment/todo-backend'
                sh 'kubectl rollout status deployment/todo-frontend'
                sh 'kubectl get pods,svc'
            }
        }
    }
}
