pipeline {
    agent any

    stages {
        stage('vm node version') {
            steps {
                sh '''
                   sudo su -
                   node -v
                   npm -v
                '''
            }
        }
    }
}