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
        justifyContent: 'center',
        marginBottom: 20,
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    error: {
        backgroundColor: 'red',
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 8,
        paddingRight: 8
    },
    flexGrow: {
        flex: 1
    },
    formContainer: {
        width: '100%'
    },
    signUpForm: {
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: '10%',
    },
    submissionContainer: {

    }
});


class ForgotPassword extends React.Component {
    static defaultProps = {
        authData: {},
        authState: 'forgotPassword',
        onAuthStateChange: (next, data) => { console.log(`SignUp:onAuthStateChange(${next}, ${JSON.stringify(data, null, 2)})`); }
    };

    constructor(props) {
        super(props);
        this.state = {
            authData: this.props.authData,
            authState: this.props.authState,
            modalShowing: false,
            error: null,
            loading: false,
            username: '',
            password: ''
        };
    }

    async onSubmitForm() {
        try {
            this.setState({ loading: true });
            const response = await Auth.forgotPassword(this.state.username);
            console.log(`ForgotPassword::onSubmitForm(): Response#1 = ${JSON.stringify(response, null, 2)}`);
            this.setState({ authData: response, modalShowing: true, loading: false });
        } catch (err) {
            console.log(`ForgotPassword::onSubmitForm(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: err.message, loading: false });
        }
    }

    async onConfirmSubmitted(token) {
        try {
            this.setState({ loading: true });
            const response = await Auth.forgotPasswordSubmit(this.state.username, token, this.state.password);
            console.log(`ForgotPassword::onConfirmSubmitted(): Response#2 = ${JSON.stringify(response, null, 2)}`);
            this.setState({ loading: false });
            this.props.onAuthStateChange('default', { username: this.state.username });
        } catch (err) {
            console.log(`ForgotPassword::onConfirmSubmitted(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: err.message, loading: false, modalShowing: false });
        }
    }

    render() {
        let settings = {
            cancelButton: {
              borderRadius: 21,
              borderWidth: 2,
              borderColor: 'white',
              width: 120,
              height: 42,
              padding: 10,
              alignSelf: 'center',
              textAlign: 'center',
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              letterSpacing: 2,
              marginLeft: 20,
              marginRight: 10,
            },
            confirmPrompt: {
                isVisible: this.state.modalShowing,
                title: 'Confirmation Required',
                description: 'Enter the six digit token you were just sent',
                onSubmit: (token) => this.onConfirmSubmitted(token)
            },
            usernameInput: {
                iconColor: '#19bec1',
                iconName: 'user',
                iconSize: 24,
                autoCorrect: false,
                autoCapitalize: 'none',
                returnKeyType: 'next',
                placeholder: 'Username',
                placeholderTextColor: '#404040',
                value: this.state.username,
                onChangeText: (text) => this.setState({ username: text.toLowerCase() })
            },
            passwordInput: {
                iconColor: '#19bec1',
                iconName: 'lock',
                iconSize: 24,
                autoCorrect: false,
                autoCapitalize: 'none',
                returnKeyType: 'done',
                secureTextEntry: true,
                placeholder: 'New Password',
                placeholderTextColor: '#404040',
                value: this.state.password,
                onChangeText: (text) => this.setState({ password: text })
            },
            submitButton: {
              borderRadius: 21,
              borderWidth: 2,
              borderColor: '#45e8eb',
              width: 230,
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
            ? <View style={styles.errorContainer}><Text style={styles.error}>{this.state.error}</Text></View>
            : false;

        return (
            <Wrapper>
                {this.state.error !== null && errorComponent}
                <View style={styles.signUpForm}>
                    <View style={styles.formContainer}>
                        <IconTextInput {...settings.usernameInput}/>
                        <IconTextInput {...settings.passwordInput}/>
                        <View style={styles.submissionContainer}>
                          <TouchableOpacity onPress={() => this.onSubmitForm()}>
                            <Text style={settings.submitButton}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Change Password'.toUpperCase() }</Text>
                          </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.flexGrow}/>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity disabled={this.state.loading} onPress={() => this.props.onAuthStateChange('default', {})}>
                    <Text style={settings.cancelButton}>{ 'Cancel'.toUpperCase() }</Text>
                  </TouchableOpacity>
                </View>
                <ModalTokenInput {...settings.confirmPrompt}/>
            </Wrapper>
        );
    }
}

export default ForgotPassword;
