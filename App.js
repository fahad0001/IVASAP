import React, { Component } from 'react';
import { View } from 'react-native';
import App from './src/index';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { Auth } from 'aws-amplify';

Amplify.configure(aws_exports);
Auth.configure({ autoRefresh: false });

class AppWithAuth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {}
    }
  }
  render(){
    return (
      <App />
    );
  }
}

console.disableYellowBox = true;

export default AppWithAuth;
