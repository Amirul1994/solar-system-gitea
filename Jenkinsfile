pipeline {
    agent any

    tools {
        nodejs 'nodejs-22-6-0'
        dependencyCheck 'OWASP-DepCheck-10.3.0' // Specify the Dependency-Check tool version
    }
    
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

        stage('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }
        }

        stage('Dependency Scanning') {
            parallel {
                stage('npm dependency audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                        '''
                    }
                }

                stage('OWASP Dependency Check') {
                    steps {
                        script {
                            // Run dependency-check with additional arguments
                            dependencyCheck additionalArguments: ''' dependency-check --scan './' 
                                                                    --out './' 
                                                                    --format 'ALL'
                                                                    --prettyPrint 
                                                                    --disableYarnAudit 
                                                                    --suppression '/var/lib/jenkins/workspace/ud-jenkins_feature_enabling-cicd/suppression.xml' 
                                                                    --disableHostedSuppressions ''', 
                                             nvdCredentialsId: 'dependency-check-nvd-api-key', 
                                             odcInstallation: 'OWASP-DepCheck-10.3.0'
                        }
                    }
                }
            }
        }
    }
}