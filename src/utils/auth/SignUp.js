import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import IconTextInput from './ui/IconTextInput';
import ModalTokenInput from './ui/ModalTokenInput';
import Wrapper from './ui/Wrapper';
import { Auth } from 'aws-amplify';
import * as EmailValidator from 'email-validator';

import getSettings from '../../config/formSettings';

const styles = StyleSheet.create({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: -30,
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
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
        width: '100%',
        marginTop: '20%',
        height: 500,
    },
    signUpForm: {
        marginLeft: '10%',
        marginRight: '10%',
        marginTop: '30%',
        height: 530,
    }

});


class SignUp extends React.Component {
    static defaultProps = {
        authData: {},
        authState: 'signUp',
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
            firstName: '',
            lastName: '',
            emailaddress: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            password: ''
        };
    }

    async onSignUp() {
        if (this.state.firstName.length === 0 || this.state.lastName.length === 0) {
          this.setState({ error: 'First Name and Last Name are required', loading: false });
          return;
        }

        if (this.state.address.length === 0 || this.state.city.length === 0 || this.state.state.length === 0 || this.state.zip.length === 0) {
          this.setState({ error: 'Address is required', loading: false });
          return;
        }

        if (!EmailValidator.validate(this.state.emailaddress)) {
          this.setState({ error: 'Email address is invalid', loading: false });
          return;
        }

        var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{5,6}$/im;
        if (!phoneRe.test(this.state.phone.replace(/\D/g, ""))) {
          this.setState({ error: 'Phone Number is invalid', loading: false });
          return;
        }

        try {
            this.setState({ loading: true });
            const response = await Auth.signUp({
              username: this.state.username,
              password: this.state.password,
              attributes: {
                email: this.state.emailaddress,
                phone_number: this.state.phone,
                'custom:first_name': this.state.firstName,
                'custom:last_name': this.state.lastName,
                'custom:address': this.state.address,
                'custom:city': this.state.city,
                'custom:state': this.state.state,
                'custom:zip': this.state.zip,
              }
            });
            console.log(`SignUp::onSignUp(): Response#1 = ${JSON.stringify(response, null, 2)}`);
            if (response.userConfirmed === false) {
                this.setState({ authData: response, modalShowing: true, loading: false });
            } else {
                this.onAuthStateChange('default', { username: response.username });
            }
        } catch (err) {
            console.log(`SignUp::onSignUp(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: (err.message || err), loading: false });
        }
    }

    async onConfirmSubmitted(token) {
        try {
            this.setState({ loading: true });
            const response = await Auth.confirmSignUp(this.state.username, token);
            console.log(`SignUp::onConfirmSubmitted(): Response#2 = ${JSON.stringify(response, null, 2)}`);
            this.setState({ loading: false });
            if (response === 'SUCCESS') {
                this.props.onAuthStateChange('default', { username: this.state.username });
            }
        } catch (err) {
            console.log(`SignUp::onConfirmSubmitted(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: (err.message || err), loading: false });
        }
    }

    render() {
        const errorComponent = this.state.error !== null
            ? <View style={styles.errorContainer}><Text style={styles.error}>{this.state.error}</Text></View>
            : false;

        const settings = getSettings(this)

        return (
            <Wrapper>
            {this.state.error !== null && errorComponent}
            <KeyboardAvoidingView behavior="height">
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                  <View style={styles.signUpForm}>
                        <View style={styles.formContainer}>
                            <IconTextInput {...settings.usernameInput}/>
                            <IconTextInput {...settings.firstNameInput}/>
                            <IconTextInput {...settings.lastNameInput}/>
                            <IconTextInput {...settings.emailInput}/>
                            <IconTextInput {...settings.phoneInput}/>
                            <IconTextInput {...settings.addressInput}/>
                            <IconTextInput {...settings.cityInput}/>
                            <IconTextInput {...settings.stateInput}/>
                            <IconTextInput {...settings.zipInput}/>
                            <IconTextInput {...settings.passwordInput}/>
                        </View>

                  </View>
                  </ScrollView>
                  </KeyboardAvoidingView>
                <View style={styles.flexGrow}/>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity onPress={() => this.onSignUp()}>
                    <Text style={settings.submitButton}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Sign Up'.toUpperCase() }</Text>
                  </TouchableOpacity>
                  <TouchableOpacity disabled={this.state.loading} onPress={() => this.props.onAuthStateChange('default', {})}>
                    <Text style={settings.cancelButton}>{ 'Cancel'.toUpperCase() }</Text>
                  </TouchableOpacity>
                </View>
                <ModalTokenInput {...settings.confirmPrompt}/>
            </Wrapper>
        );
    }
}

export default SignUp;
