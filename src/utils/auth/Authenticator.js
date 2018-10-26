import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Router, Scene, Button, Text } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import { Provider } from 'react-redux';

import ForgotUsername from './ForgotUsername';
import ForgotPassword from './ForgotPassword';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Services from '../../screens/Services';

class Authenticator extends Component {
    static defaultProps = {
        initialState: 'default',
        initialData: {},
        tabBarVisible: false,
        onAuthenticated: async (authData) => {
          try {
            console.log(`Authenticate::onAuthenticated(${JSON.stringify(authData, null, 2)}`);

            await AsyncStorage.setItem('@SuperStore:username', authData.username);
            await AsyncStorage.setItem('@SuperStore:email', authData.signInUserSession.idToken.payload.email);
            await AsyncStorage.setItem('@SuperStore:phoneNumber', authData.signInUserSession.idToken.payload.phone_number);
            await AsyncStorage.setItem('@SuperStore:firstName', authData.signInUserSession.idToken.payload['custom:first_name']);
            await AsyncStorage.setItem('@SuperStore:lastName', authData.signInUserSession.idToken.payload['custom:last_name']);
            await AsyncStorage.setItem('@SuperStore:address', authData.signInUserSession.idToken.payload['custom:address']);
            await AsyncStorage.setItem('@SuperStore:city', authData.signInUserSession.idToken.payload['custom:city']);
            await AsyncStorage.setItem('@SuperStore:state', authData.signInUserSession.idToken.payload['custom:state']);
            await AsyncStorage.setItem('@SuperStore:zip', authData.signInUserSession.idToken.payload['custom:zip']);
            await AsyncStorage.setItem('@SuperStore:customerId', authData.signInUserSession.idToken.payload['custom:customer_id'] || '');
            await AsyncStorage.setItem('@SuperStore:isNurse', (authData.signInUserSession.idToken.payload['custom:is_ivasap_nurse'] || '0'));
            await AsyncStorage.setItem('@SuperStore:cart', JSON.stringify([]));

            const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse');

            if (isNurseFlag === '1') {
              Actions.nurse_drips();
            } else {
              Actions.services();
            }

            return authData;
          } catch (error) {
            alert(error);
          }
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            authState: this.props.initialState,
            authData: this.props.initialData,
        };
    }

    onAuthStateChange(newState, newData) {
        const data = Object.assign({}, this.state.authData, newData);
        this.setState({ authState: newState, authData: data });
        if (newState === 'authenticated') {
            this.props.onAuthenticated(data);
        }
    }

    render() {
        const props = {
            authData: this.state.authData,
            authState: this.state.authState,
            onAuthStateChange: (s,d) => this.onAuthStateChange(s,d)
        };

        switch (this.state.authState) {
            case 'authenticated':
              return <Services />
            case 'forgotUsername':
                return <ForgotUsername {...props} />
            case 'forgotPassword':
                return <ForgotPassword {...props} />
            case 'signUp':
                return <SignUp {...props} />
            case 'signIn':
            default:
                return <SignIn {...props} />
        };
    }
}

export default Authenticator;
