pipeline {
    agent any

    tools {
        nodejs 'nodejs-22-6-0'
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
                            try {
                                dependencyCheck additionalArguments: ''' dependency-check --scan './' 
                                                                        --out './' 
                                                                        --format 'ALL'
                                                                        --prettyPrint 
                                                                        --disableYarnAudit 
                                                                        --suppression '/var/lib/jenkins/workspace/ud-jenkins_feature_enabling-cicd/suppression.xml' 
                                                                        --disableHostedSuppressions ''', 
                                                 nvdCredentialsId: 'dependency-check-nvd-api-key', 
                                                 odcInstallation: 'OWASP-DepCheck-11'
                            } catch (Exception e) {
                                // Capture the output of the dependency-check command
                                def output = e.getMessage()

                                // Define the specific log messages to ignore
                                def suppressionMessages = [
                                    "Suppression Rule had zero matches: SuppressionRule{packageUrl=PropertyType{value=^pkg:maven/io\\.etcd/jetcd-[a-z]*@.*\${5}, regex=true, caseSensitive=false},cpe={PropertyType{value=cpe:/a:redhat:etcd, regex=false, caseSensitive=false},PropertyType{value=cpe:/a:etcd:etcd, regex=false, caseSensitive=false},}}",
                                    "Suppression Rule had zero matches: SuppressionRule{packageUrl=PropertyType{value=^pkg:maven/io\\.etcd/jetcd-grpc@.*\${5}, regex=true, caseSensitive=false},cpe={PropertyType{value=cpe:/a:grpc:grpc, regex=false, caseSensitive=false},}}"
                                ]

                                // Check if the output contains any of the suppression messages
                                def shouldIgnore = suppressionMessages.any { message ->
                                    output.contains(message)
                                }

                                // If the output contains any of the suppression messages, ignore the exception
                                if (!shouldIgnore) {
                                    throw e
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
