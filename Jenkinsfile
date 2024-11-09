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
                   echo $SUDO_PASS | sudo -S /home/amirul/.nvm/versions/node/v23.1.0/bin/node -v
                   
                   echo $SUDO_PASS | sudo -S bash -c "
                   source /home/amirul/.nvm/nvm.sh
                   /home/amirul/.nvm/versions/node/v23.1.0/bin/npm -v
                   "
                
                '''
                }
            }
        }
    }
}