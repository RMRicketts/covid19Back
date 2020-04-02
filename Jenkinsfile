pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        git url: 'https://github.com/nytimes/covid-19-data'
      }
    }
    stage('post to api'){
      steps {
        sh 'node postCovidData.js'
      }
    }
  }
}
