pipeline {
    agent any

    stages {
        stage('vm node version') {
            steps {
                sh "chmod +x -R ${env.WORKSPACE}"
                sh '''
                   node -v
                   npm -v
                '''
            }
        }
    }
}