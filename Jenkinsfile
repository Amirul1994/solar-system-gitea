pipeline {
    agent any

    stages {
        stage('vm node version') {
            steps {
                sh '''
                    node -v
                    npm -v
                '''
            }
        }
    }
}