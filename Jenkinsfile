pipeline {
    agent any

    stages {
        stage('vm node version') {
            steps {
                sh '''
                   sudo node -v
                   sudo npm -v
                '''
            }
        }
    }
}