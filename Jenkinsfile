pipeline {
    agent any

    environment {
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
                    script {
                        docker.image('node:20-alpine').inside {
                            sh 'npm install'
                            sh 'npm test'
                        }
                    }
                }
            }
        }

        stage('Build Docker images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Run Containers (Smoke Test))') {
            steps {
                sh 'docker compose up -d'
                sh 'sleep 15'
                sh 'curl -f http://localhost:8080/api/hello || (echo "Health check failed" && exit 1)'
            }
        }
    }

    post {
        always {
            sh 'docker compose down || true'
        }
    }
}
