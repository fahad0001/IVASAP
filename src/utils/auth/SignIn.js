import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import IconTextInput from './ui/IconTextInput';
import ModalTokenInput from './ui/ModalTokenInput';
import Wrapper from './ui/Wrapper';
import { Button } from 'react-native-elements';

import { Auth } from 'aws-amplify';

const styles = StyleSheet.create({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%'
    },
    alertContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    error: {
        backgroundColor: 'red',
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 8,
        paddingRight: 8,
    },
    success: {
        backgroundColor: 'green',
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 8,
        paddingRight: 8,
    },
    flexGrow: {
        flex: 1
    },
    signInForm: {
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: '10%',
    },
    signInFormContainer: {
        width: '100%'
    }
});

class SignIn extends React.Component {
    static defaultProps = {
        authData: {},
        authState: 'signIn',
        onAuthStateChange: (next, data) => { console.log(`SignIn:onAuthStateChange(${next}, ${JSON.stringify(data, null, 2)})`); }
    };

    constructor(props) {
        super(props);
        this.state = {
            authData: this.props.authData,
            authState: this.props.authState,
            modalShowing: false,
            loading: false,
            error: null,
            success: null,
            username: this.props.authData.username || '',
            password: this.props.authData.password || '',
            passwordType: false,
            user: null
        };
    }

    async onSignIn() {
        this.setState({ loading: true });
        try {
            const data = await Auth.signIn(this.state.username, this.state.password);
            // console.log(`onSignIn::Response#1: ${JSON.stringify(data, null, 2)}`);

            // If the user session is not null, then we are authenticated
            if (data.signInUserSession !== null) {
                this.props.onAuthStateChange('authenticated', data);
                return;
            }

            // If there is a challenge, then show the modal
            if ('challengeName' in data) {
                if (data.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    this.setState({passwordType: true})
                }
                else {
                    console.log(`onSignIn: Expecting challenge to be recieved via ${data.challengeType}`);
                }
                this.setState({ user: data, loading: false, modalShowing: true });
                return;
            }

            // Anything else and there is a problem
            throw new Error('Invalid response from server');
        } catch (err) {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: (err.message || err), loading: false });
        }
    }

    async onConfirmSignin(token) {
        this.setState({ loading: true });
        try {
            console.log(`onConfirmSignIn:: ${this.state.username}, ${token}`);
            const data = await Auth.confirmSignIn(this.state.user, token);
            console.log(`onConfirmSignIn::Response#2: ${JSON.stringify(data, null, 2)}`);
            const profile = await Auth.currentUser();
            this.props.onAuthStateChange('authenticated', profile);
        } catch (err) {
            console.log('Error: ', err);
            this.setState({ error: (err.message || err), loading: false, modalShowing: false });
        }
    }

    async onConfirmPassword(password) {
        this.setState({ loading: true, error: null, success: null });
        const userAttribute = {
            email: this.state.user.challengeParam.userAttributes.email,
            phone_number: this.state.user.challengeParam.userAttributes.phone_number,
        };

        try {
            console.log(`onConfirmPassword:: ${this.state.username}`);
            this.state.user.completeNewPasswordChallenge(password, userAttribute, {
                onSuccess: result => {
                    console.log('Successful '+ result);
                    this.props.onAuthStateChange('default', { username: this.state.username });
                    this.setState({loading: false, modalShowing: false,
                        username: '', password: '',success: 'New password set successfully!' });
                },
                onFailure: error => {
                    console.log('Error: '+ error);
                    this.setState({ error: (error.message || error), loading: false, modalShowing: false });

                }
            });
        } catch (err) {
            console.log('Error: ', err);
            this.setState({ error: (err.message || err), loading: false, modalShowing: false });
        }
    }

    render() {
        let settings = {
            signUpButton: {
                borderRadius: 21,
                borderWidth: 2,
                borderColor: 'white',
                width: 100,
                height: 42,
                padding: 10,
                alignSelf: 'center',
                textAlign: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 13,
                fontWeight: 'bold',
                letterSpacing: 2,
                marginLeft: '3%',
                marginRight: 10,
            },
            forgotPasswordButton: {
                borderRadius: 21,
                borderWidth: 2,
                borderColor: 'white',
                width: 110,
                height: 42,
                padding: 8,
                alignSelf: 'center',
                textAlign: 'center',
                color: 'white',
                fontSize: 8,
                fontWeight: 'bold',
                letterSpacing: 2,
                marginRight: '2%',
            },
            promptConfig:  this.state.passwordType ? {
                isVisible: this.state.modalShowing,
                isPassword: true,
                title: 'New Password Required',
                description: 'Enter new password for the account.',
                onSubmit: (password) => this.onConfirmPassword(password)
            } : {
                isVisible: this.state.modalShowing,
                title: 'MFA Token Required',
                description: 'Enter the six digit token you were just sent.',
                onSubmit: (token) => this.onConfirmSignin(token)
            },
            usernameInput: {
                iconColor: '#19bec1',
                iconName: 'user',
                iconSize: 24,
                autoCapitalize: 'none',
                autoCorrect: false,
                returnKeyType: 'next',
                placeholder: 'Username',
                placeholderTextColor: '#404040',
                value: this.state.username,
                onChangeText: (text) => this.setState({ username: text })
            },
            passwordInput: {
                iconColor: '#19bec1',
                iconName: 'lock',
                iconSize: 24,
                autoCapitalize: 'none',
                autoCorrect: false,
                returnKeyType: 'done',
                secureTextEntry: true,
                placeholder: 'Password',
                placeholderTextColor: '#404040',
                value: this.state.password,
                onChangeText: (text) => this.setState({ password: text })
            },
            submitButton: {
                borderRadius: 21,
                borderWidth: 2,
                borderColor: '#45e8eb',
                width:  200,
                height: 42,
                padding: 10,
                alignSelf: 'center',
                textAlign: 'center',
                color: '#19bec1',
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 2,
            }
        };

        const errorComponent = this.state.error !== null
            ? <View style={styles.alertContainer}><Text style={styles.error}>{this.state.error}</Text></View>
            : false;

        const successComponent = this.state.success != null
            ? <View style={styles.alertContainer}><Text style={styles.success}>{this.state.success}</Text></View>
            : false;

        return (
            <Wrapper>
                {this.state.error !== null && errorComponent}
                {this.state.success !== null && successComponent}
                <View style={styles.signInForm}>
                    <View style={styles.signInFormContainer}>
                        <IconTextInput {...settings.usernameInput}/>
                        <IconTextInput {...settings.passwordInput}/>
                        <View style={styles.signInFormButtons}>
                          <TouchableOpacity onPress={() => this.onSignIn(this.state.username, this.state.password)}>
                            <Text style={settings.submitButton}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Sign In'.toUpperCase() }</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.flexGrow}/>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity disabled={this.state.loading} onPress={() => this.props.onAuthStateChange('signUp', {})}>
                    <Text style={settings.signUpButton}>{ 'Sign Up'.toUpperCase() }</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.loading} onPress={() => this.props.onAuthStateChange('forgotUsername', {})}>
                    <Text style={settings.forgotPasswordButton}>{ 'Forgot Username'.toUpperCase() }</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.loading} onPress={() => this.props.onAuthStateChange('forgotPassword', {})}>
                    <Text style={settings.forgotPasswordButton}>{ 'Forgot Password'.toUpperCase() }</Text>
                  </TouchableOpacity>
                </View>
                <ModalTokenInput {...settings.promptConfig}/>
            </Wrapper>
        );
    }
}

export default SignIn;
