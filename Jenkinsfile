pipeline {
    agent any

    tools {
        nodejs 'nodejs-22-6-0'
    }
    
    environment {
        USER = 'amirul'
        MONGO_URI = "mongodb+srv://supercluster.d83jj.mongodb.net/superData"
        MONGO_DB_CREDS = credentials('mongo-db-credentials')
        MONGO_USERNAME = credentials('mongo-db-username')
        MONGO_PASSWORD = credentials('mongo-db-password')
        //SONAR_SCANNER_HOME = tool 'sonarqube-scanner-610'
    }

    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
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
            options { timestamps() }
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
                        dependencyCheck additionalArguments: '''--scan './' --out './' --format 'ALL' --prettyPrint --disableYarnAudit''', 
                                        nvdCredentialsId: 'dependency-check-nvd-api-key', 
                                        odcInstallation: 'OWASP-DepCheck-11'
                        
                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: true
                    }
                } 
            }
        }

        stage('Unit Testing') {
            steps {
                sh 'echo Colon-Seperated - $MONGO_DB_CREDS'       
                sh 'echo Username - $MONGO_DB_CREDS_USR'
                sh 'echo Password - $MONGO_DB_CREDS_PSW'        
                sh 'npm test'
            }
        }

        stage('Code Coverage') {
            steps {
                catchError(buildResult: 'SUCCESS', message: 'Oops! it will be fixed in future releases', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
                }
            }
        }

        /*
        stage('SAST - SonarQube') {
            steps {
                timeout(time: 60, unit: 'SECONDS') {
                    withSonarQubeEnv('sonar-qube-server') {
                        sh 'echo $SONAR_SCANNER_HOME'
                
                        sh '''
                            $SONAR_SCANNER_HOME/bin/sonar-scanner \
                                 -Dsonar.projectKey=Kodekloud-System-Project \
                                 -Dsonar.sources=. \
                                 -Dsonar.host.url=http://localhost:9000 \
                                 -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
                                 -Dsonar.tests=
                        '''
                    }
                    waitForQualityGate abortPipeline: true
                }
            }
        }*/ 

        stage('Build Docker Image') {
            steps {
                sh 'printenv'
                sh 'sudo docker build -t amirul1994/solar-system:$GIT_COMMIT .'
            }
        }

        stage('Trivy Vulnerability Scanner') {
            steps {
                sh ''' 
                    sudo trivy image amirul1994/solar-system:$GIT_COMMIT \
                        --severity LOW,MEDIUM \
                        --exit-code 0 \
                        --quiet \
                        --format json -o trivy-image-MEDIUM-results.json

                    sudo trivy image amirul1994/solar-system:$GIT_COMMIT \
                        --severity HIGH,CRITICAL \
                        --exit-code 1 \
                        --quiet \
                        --format json -o trivy-image-CRITICAL-results.json             
                '''
            }

            post {
                always {
                    sh '''
                        sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/html.tpl" --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json
                        
                        sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/html.tpl" --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json
                        
                        sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/junit.tpl" --output trivy-image-MEDIUM-results.xml trivy-image-MEDIUM-results.json
                        
                        sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/junit.tpl" --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json
                    '''
                }
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results.xml'
            
            junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'

            junit allowEmptyResults: true, testResults: 'trivy-image-CRITICAL-results.xml'
            
            junit allowEmptyResults: true, testResults: 'trivy-image-MEDIUM-results.xml'


            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-CRITICAL-results.html', reportName: 'Trivy Image Critical Vul Report', reportTitles: '', useWrapperFileDirectly: true])

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-MEDIUM-results.html', reportName: 'Trivy Image Medium Vul Report', reportTitles: '', useWrapperFileDirectly: true])

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: ''])
            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Code Coverage HTML Report', reportTitles: ''])
        }
    }
}
