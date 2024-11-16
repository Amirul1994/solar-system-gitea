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
        GITHUB_TOKEN = credentials('github-api-token')
        // DOCKER_USERNAME = ''
        // DOCKER_PASSWORD = ''
        // SONAR_SCANNER_HOME = tool 'sonarqube-scanner-610'
    }

    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
    }

    stages {

        //  stage('VM Node Version') {
        //      steps {
        //          withCredentials([string(credentialsId: 'amirul-sudo-password', variable: 'SUDO_PASS')]) {
        //              sh '''
        //                  echo $SUDO_PASS | sudo -S /home/amirul/.nvm/versions/node/v23.1.0/bin/node -v
        //                  echo $SUDO_PASS | sudo -S bash -c "
        //                  source /home/amirul/.nvm/nvm.sh
        //                  /home/amirul/.nvm/versions/node/v23.1.0/bin/npm -v
        //                  "
        //              '''
        //          }
        //      }
        // }

        // stage('Installing Dependencies') {
        //     options { timestamps() }
        //     steps {
        //         sh 'npm install --no-audit'
        //     }
        // }

        // stage('Dependency Scanning') {
        //     parallel {
        //         stage('NPM Dependency Audit') {
        //             steps {
        //                 sh '''
        //                     npm audit --audit-level=critical
        //                     echo $?
        //                 '''
        //             }
        //         }

        //         stage('OWASP Dependency Check') {
        //             steps {
        //                 dependencyCheck additionalArguments: '''--scan './' --out './' --format 'ALL' --prettyPrint --disableYarnAudit''',
        //                                 nvdCredentialsId: 'dependency-check-nvd-api-key',
        //                                 odcInstallation: 'OWASP-DepCheck-11'

        //                 dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: true
        //             }
        //         }
        //     }
        // }

        // stage('Unit Testing') {
        //     steps {
        //         sh 'echo Colon-Separated - $MONGO_DB_CREDS'
        //         sh 'echo Username - $MONGO_DB_CREDS_USR'
        //         sh 'echo Password - $MONGO_DB_CREDS_PSW'
        //         sh 'npm test'
        //     }
        // }

        // stage('Code Coverage') {
        //     steps {
        //         catchError(buildResult: 'SUCCESS', message: 'Oops! it will be fixed in future releases', stageResult: 'UNSTABLE') {
        //             sh 'npm run coverage'
        //         }
        //     }
        // }

        
        // stage('SAST - SonarQube') {
        //     steps {
        //         timeout(time: 60, unit: 'SECONDS') {
        //             withSonarQubeEnv('sonar-qube-server') {
        //                 sh 'echo $SONAR_SCANNER_HOME'

        //                 sh '''
        //                     $SONAR_SCANNER_HOME/bin/sonar-scanner \
        //                          -Dsonar.projectKey=Kodekloud-System-Project \
        //                          -Dsonar.sources=. \
        //                          -Dsonar.host.url=http://localhost:9000 \
        //                          -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
        //                          -Dsonar.tests=
        //                 '''
        //             }
        //             waitForQualityGate abortPipeline: true
        //         }
        //     }
        // }
        

        stage('Build Docker Image') {
            steps {
                sh 'printenv'
                sh 'sudo docker build -t amirul1994/solar-system:$GIT_COMMIT .'
            }
        }

        // stage('Trivy Vulnerability Scanner') {
        //     steps {
        //         sh '''
        //             sudo trivy image amirul1994/solar-system:$GIT_COMMIT \
        //                 --severity LOW,MEDIUM,HIGH \
        //                 --exit-code 0 \
        //                 --quiet \
        //                 --format json -o trivy-image-MEDIUM-results.json

        //             sudo trivy image amirul1994/solar-system:$GIT_COMMIT \
        //                 --severity CRITICAL \
        //                 --exit-code 1 \
        //                 --quiet \
        //                 --format json -o trivy-image-CRITICAL-results.json
        //         '''
        //     }

        //     post {
        //         always {
        //             sh '''
        //                 sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/html.tpl" --output trivy-image-MEDIUM-results.html trivy-image-MEDIUM-results.json
        //                 sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/html.tpl" --output trivy-image-CRITICAL-results.html trivy-image-CRITICAL-results.json
        //                 sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/junit.tpl" --output trivy-image-MEDIUM-results.xml trivy-image-MEDIUM-results.json
        //                 sudo trivy convert --format template --template "@/usr/local/share/trivy/templates/junit.tpl" --output trivy-image-CRITICAL-results.xml trivy-image-CRITICAL-results.json
        //             '''
        //         }
        //     }
        // }

        stage('Push Docker Image') {
            steps {
                withDockerRegistry([credentialsId: "docker-hub-credentials", url: ""]) {
                    sh 'sudo docker push amirul1994/solar-system:$GIT_COMMIT'
                }
            }
        }

        // stage('Deploy - AWS EC2') {
        //     when {
        //         branch 'feature/*'
        //     }

        //     steps {
        //         script {
        //             withAWS(credentials: 'aws-s3-ec2-lambda-creds', region: 'us-east-1') {
        //                 sshagent(['aws-dev-deploy-ec2-instance']) {
        //                     withCredentials([
        //                         string(credentialsId: 'mongo-db-username', variable: 'MONGO_USERNAME'),
        //                         string(credentialsId: 'mongo-db-password', variable: 'MONGO_PASSWORD')
        //                     ]) {
                                
        //                         def publicIp = sh(script: '''
        //                             bash get_public_ip_address.sh
        //                         ''', returnStdout: true).trim()

                                
        //                         sh """
        //                             ssh -o StrictHostKeyChecking=no ubuntu@${publicIp} "
        //                                 if sudo docker ps -a | grep -q 'solar-system'; then
        //                                     echo 'Container found. Stopping...'
        //                                     sudo docker stop 'solar-system' && sudo docker rm 'solar-system'
        //                                     echo 'Container stopped and removed.'
        //                                 fi
        //                                 sudo docker run --name solar-system \
        //                                     -e MONGO_URI=${env.MONGO_URI} \
        //                                     -e MONGO_USERNAME=${MONGO_USERNAME} \
        //                                     -e MONGO_PASSWORD=${MONGO_PASSWORD} \
        //                                     -p 3000:3000 -d amirul1994/solar-system:$GIT_COMMIT
        //                             "
        //                         """
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        // stage('Integration Testing - AWS EC2') {
        //     when {
        //         branch 'feature/*'
        //     }

        //     steps {
        //         sh 'printenv | grep -i branch'
        //         withAWS(credentials: 'aws-s3-ec2-lambda-creds', region: 'us-east-1') {
        //             sh '''
        //                 bash integration-testing-ec2.sh
        //             '''
        //         }
        //     }
        // } 

        // stage('K8S Update Image Tag') {
        //     // when {
        //     //     branch 'PR*'
        //     // } 
        //     steps {
        //         sh 'git clone -b main https://github.com/Amirul1994/solar-system-gitops-argocd'
        //         dir("solar-system-gitops-argocd/kubernetes"){
        //             sh ''' 
        //                 git checkout main
        //                 git checkout -b feature-$BUILD_ID
        //                 sed -i "s#amirul1994.*#amirul1994/solar-system:$GIT_COMMIT#g" deployment.yaml
        //                 cat deployment.yaml 

        //                 git config --global user.email "amirulbrinto90@gmail.com"
        //                 git remote set-url origin https://$GITHUB_TOKEN@github.com/amirul1994/solar-system-gitops-argocd.git
        //                 git add .
        //                 git commit -m "updated docker image"
        //                 git push -u origin feature-$BUILD_ID
        //             '''
        //         }
        //     }
        // }

        // stage('K8S - Raise PR') {
        //     // when {
        //     //     branch 'PR*'
        //     // } 
        //     steps {
        //         // get the sample commad from https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28 
        //         sh """ 
        //             curl -L \
        //                  -X POST \
        //                  -H "Accept: application/vnd.github+json" \
        //                  -H "Authorization: Bearer $GITHUB_TOKEN" \
        //                  -H "X-GitHub-Api-Version: 2022-11-28" \
        //                   https://api.github.com/repos/amirul1994/solar-system-gitops-argocd/pulls \
        //                  -d '{"title":"Updated Docker Image","body":"updated docker image in deployment manifest","head":"feature-'${BUILD_ID}'","base":"main"}'

        //         """
        //     }
        // } 
        
        // stage('APP Deployed?') {
        //     // when {
        //     //     branch 'PR*'
        //     // }
        //     // steps {
        //     //     timeout(time: 1, unit: 'DAYS') {
        //     //         input message: 'Is the PR Merged and ArgoCD Synced?', ok: 'YES! PR is Merged and ArgoCD Application is Synced'
        //     //     }
        //     // }
        // }

        // stage('DAST - OWASP ZAP') {
        //     // when {
        //     //     branch 'PR*'
        //     // }
        //     steps {
        //        sh ''' 
        //             chmod 777 $(pwd)
        //             sudo docker run -v $(pwd):/zap/wrk/:rw  ghcr.io/zaproxy/zaproxy zap-api-scan.py \
        //             -t http://192.168.0.107:32300/api-docs/ \
        //             -f openapi \
        //             -r zap_report.html \
        //             -w zap_report.md \
        //             -J zap.json_report.json \
        //             -x zap.xml_report.xml \
        //             -c zap_ignore_rules
        //         ''' 
        //     }
        // }

        stage('Upload - AWS S3') {
            when {
                branch 'PR*'
            } 
            steps {
                withAWS(credentials: 'aws-s3-ec2-lambda-creds', region: 'us-east-1'){
                    sh '''
                        ls -ltr 
                        sudo mkdir reports-$BUILD_ID/
                        sudo cp -rf coverage/ reports-$BUILD_ID/
                        sudo cp dependency*.* test-results.xml trivy*.* zap*.* reports-$BUILD_ID/
                        ls -ltr reports-$BUILD_ID/
                    '''
                    s3Upload(
                        file:"reports-$BUILD_ID",
                        bucket:'solar-system-gitea-jenkins-reports-bucket',
                        path:"jenkins-$BUILD_ID/"
                    )
                }    
            }
        }
        
    }

    post {
        always {
            script {
                if (fileExists('solar-system-gitops-argocd')) {
                    sh 'rm -rf solar-system-gitops-argocd'
                }
            }
            junit allowEmptyResults: true, testResults: 'test-results.xml'
            
            junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'
            
            junit allowEmptyResults: true, testResults: 'trivy-image-CRITICAL-results.xml'
            
            junit allowEmptyResults: true, testResults: 'trivy-image-MEDIUM-results.xml'

            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'zap_report.html', reportName: 'DAST - OWASP ZAP Report', reportTitles: '', useWrapperFileDirectly: true])
            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-CRITICAL-results.html', reportName: 'Trivy Image Critical Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'trivy-image-MEDIUM-results.html', reportName: 'Trivy Image Medium Vul Report', reportTitles: '', useWrapperFileDirectly: true])
            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: ''])
            
            publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, keepAll: true, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Code Coverage HTML Report', reportTitles: ''])
        }
    }
}

