pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        git url: 'https://github.com/CSSEGISandData/COVID-19'
      }
    }
    stage('post to api'){
      steps {
        sh 'node /var/scripts/postCovidData.js'
      }
    }
  }
}
