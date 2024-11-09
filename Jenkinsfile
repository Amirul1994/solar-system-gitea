pipeline {
    agent any

    stages {
        stage('vm node version') {
            steps {
                // the first command will switch the user without password  
                sh '''
                   node -v
                   npm -v
                '''
            }
        }
    }
}