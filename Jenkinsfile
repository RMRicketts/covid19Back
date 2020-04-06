pipeline {
  agent any
  stages {
    stage('post to api'){
      steps {
        sh 'npm install'
        sh 'node ./scripts/refreshData.js'
      }
    }
  }
}
