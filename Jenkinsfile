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
                        // Uses Docker Pipeline plugin; runs npm inside node:20-alpine
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
                // Now that docker CLI is available in the Jenkins container, this will work
                sh 'docker compose build'
            }
        }

        stage('Run Containers (Smoke Test)') {
            steps {
                sh 'docker compose up -d'
                sh 'sleep 15'

                sh '''
                    echo "Checking backend health via frontend port..."
                    curl -f http://localhost:8080/api/hello \
                      || (echo "Health check failed" && exit 1)
                '''
            }
        }
    }

    post {
        always {
            // Clean up even if build fails
            sh 'docker compose down || true'
        }
    }
}
