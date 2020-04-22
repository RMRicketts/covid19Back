pipeline {
  agent any
  stages {
    stage('post to api'){
      steps {
        sh '/usr/local/bin/docker-compose down'
        sh '/usr/bin/docker system prune --all --force'
        sh '/usr/local/bin/node ./scripts/buildConfigs.js && source .env && /usr/local/bin/docker-compose -d up'
      }
    }
  }
}
