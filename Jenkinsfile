pipeline {
    agent any
    environment {
        USER = 'amirul'
    }

    stages {
        stage('vm node version') {
            steps {
                withCredentials([string(credentialsId: 'amirul-sudo-password', variable: 'SUDO_PASS')]) {
                sh '''
                   echo $SUDO_PASS | sudo -S node -v
                   echo $SUDO_PASS | sudo -S npm -v
                '''
                }
            }
        }
    }
}