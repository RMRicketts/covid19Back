pipeline {
  agent any
  stages {
    stage('post to api'){
      steps {
        sh 'docker-compose down'
        sh 'docker system prune --all --force'
        sh 'docker-compose -d up'
      }
    }
  }
}
