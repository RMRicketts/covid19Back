pipeline {
  agent any
  stages {
    stage('post to api'){
      steps {
        sh 'npm install'
        sh 'node ./scripts/buildConfigs.js'
        sh 'docker-compose down'
        sh 'docker system prune --all --force'
        sh 'docker-compose -d up'
      }
    }
  }
}
