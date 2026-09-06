pipeline {
    agent any

    stages {
        stage('Build Docker Images') {
            steps {
                sh 'docker build -t todo-backend:1.0.0 -t todo-backend:latest ./backend'
                sh 'docker build -t todo-frontend:1.0.0 -t todo-frontend:latest ./frontend'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    if [ -f "/var/jenkins_home/.kube/config" ]; then
                        export KUBECONFIG="/var/jenkins_home/.kube/config"
                    elif [ -f "/root/.kube/config" ]; then
                        export KUBECONFIG="/root/.kube/config"
                    fi

                    if [ -z "$KUBECONFIG" ] || [ ! -s "$KUBECONFIG" ]; then
                        echo "ERROR: Kubernetes configuration file (~/.kube/config) not found inside Jenkins container."
                        echo "Please ensure:"
                        echo "1. Kubernetes is enabled in Docker Desktop (Settings -> Kubernetes -> Enable Kubernetes)."
                        echo "2. The Jenkins container was restarted to mount ~/.kube (run: docker compose down && docker compose up -d)."
                        exit 1
                    fi

                    echo "Using kubeconfig: $KUBECONFIG"
                    kubectl apply -f k8s/ --kubeconfig="$KUBECONFIG"
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    if [ -f "/var/jenkins_home/.kube/config" ]; then
                        export KUBECONFIG="/var/jenkins_home/.kube/config"
                    elif [ -f "/root/.kube/config" ]; then
                        export KUBECONFIG="/root/.kube/config"
                    fi

                    kubectl rollout status deployment/todo-backend --kubeconfig="$KUBECONFIG"
                    kubectl rollout status deployment/todo-frontend --kubeconfig="$KUBECONFIG"
                    kubectl get pods,svc --kubeconfig="$KUBECONFIG"
                '''
            }
        }
    }
}
