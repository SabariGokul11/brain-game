pipeline {
    agent any

    environment {
        IMAGE_NAME = "memory-game-image"
        CONTAINER_NAME = "memory-game-container"
        HOST_PORT = "8085"
        CONTAINER_PORT = "80"
    }

    stages {
        stage('Show Files') {
            steps {
                sh 'pwd'
                sh 'ls -la'
                sh 'ls -la memory-game'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Sleep Before Deploy') {
            steps {
                echo 'Waiting for 10 seconds before deployment...'
                sleep time: 10, unit: 'SECONDS'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      --restart unless-stopped \
                      -p ${HOST_PORT}:${CONTAINER_PORT} \
                      ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Sleep After Deploy') {
            steps {
                echo 'Waiting for container to stabilize...'
                sleep time: 10, unit: 'SECONDS'
            }
        }

        stage('Verify Container') {
            steps {
                sh 'docker ps'
                sh 'docker container port ${CONTAINER_NAME}'
            }
        }
    }

    post {
        success {
            echo 'Deployment successful. Game server is live.'
        }
        failure {
            echo 'Pipeline failed. Please check console output.'
        }
    }
}
