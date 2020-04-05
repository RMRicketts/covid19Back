pipeline {
  agent any
  stages {
    stage('post to api'){
      steps {
        sh 'node ./scripts/postCovidData.js'
      }
    }
  }
}
