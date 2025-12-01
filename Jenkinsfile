pipeline {
    agent any

    environment {
        // Optional tagging if you later push images to a registry
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend: Install & Test') {
            steps {
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Containers (Smoke Test)') {
            steps {
                // Start in detached mode
                sh 'docker compose up -d'

                // Simple wait for services to come up
                sh 'sleep 15'

                // Basic health check on backend
                sh 'curl -f http://localhost:8080/api/hello || (echo "Health check failed" && exit 1)'
            }
        }
    }

    post {
        always {
            // Clean up containers after pipeline finishes
            sh 'docker compose down || true'
        }
    }
}
