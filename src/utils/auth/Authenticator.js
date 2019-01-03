import React, { Component } from 'react';
import {connect} from 'react-redux';
import { AsyncStorage } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Router, Scene, Button, Text } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';

import ForgotUsername from './ForgotUsername';
import ForgotPassword from './ForgotPassword';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Services from '../../screens/Services';
import portalUrl from "../../config/portalUrl";
import {
    calculateTimeMilli,
    setEventInterval,
    eventTimerHandler,
    eventTimerHandlerNurse
} from "../timer";
import {setNurseLocation} from "../../actions/locations";
import moment from "moment";

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
            await AsyncStorage.setItem('@SuperStore:firstName', authData.signInUserSession.idToken.payload['custom:first_name'] || '');
            await AsyncStorage.setItem('@SuperStore:lastName', authData.signInUserSession.idToken.payload['custom:last_name'] || '');
            await AsyncStorage.setItem('@SuperStore:address', authData.signInUserSession.idToken.payload['custom:address'] || '');
            await AsyncStorage.setItem('@SuperStore:city', authData.signInUserSession.idToken.payload['custom:city'] || '');
            await AsyncStorage.setItem('@SuperStore:state', authData.signInUserSession.idToken.payload['custom:state'] || '');
            await AsyncStorage.setItem('@SuperStore:zip', authData.signInUserSession.idToken.payload['custom:zip'] || '');
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
        this.setTimer(data.username, data.signInUserSession.idToken.payload['custom:is_ivasap_nurse'] || '0');
    }

    setTimer = async (username, isNurseFlag) => {
        try {
            // const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse');

            const response = await fetch(`${portalUrl}/${isNurseFlag !== "1" && 'my_' || ''}requests/${username}.json`);
            const json = await response.json();
            const results = json.requests || json.results;
            if (results && results.length) {
                const timeValues = calculateTimeMilli(results);
                if (isNurseFlag === '1') {
                    setEventInterval(timeValues, eventTimerHandlerNurse, this.props.setNurseLocation);
                }
                else {
                    // Initialized timer with values
                    setEventInterval(timeValues, eventTimerHandler, this.props.setNurseLocation);
                }
            }
        } catch (error) {
            alert(error);
        }
    };

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

const mapDispatchToProps = (dispatch) => {
    return {
        setNurseLocation: (nurseLocation) => dispatch(setNurseLocation(nurseLocation))
    }
};

export default connect(null, mapDispatchToProps)(Authenticator);

