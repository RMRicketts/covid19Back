pipeline {
  agent
  stages {
    stage('build') {
      steps {
        git url: 'https://github.com/nytimes/covid-19-data'
        sh 'ls'
      }
    }
  }
}
