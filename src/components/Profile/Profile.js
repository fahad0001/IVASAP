import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    AsyncStorage,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import IconTextInput from '../../utils/auth/ui/IconTextInput';
import ModalTokenInput from '../../utils/auth/ui/ModalTokenInput';
import Wrapper from '../../utils/auth/ui/Wrapper';
import Authenticator from '../../utils/auth/Authenticator';
import portalUrl from '../../config/portalUrl';

import {Auth} from 'aws-amplify';
import * as EmailValidator from 'email-validator';

import {Actions} from 'react-native-router-flux';

import styles from './styles';
import getSettings from '../../config/formSettings';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            title: 'My Profile',
            authState: '',
            username: '',
            emailaddress: '',
            phone: '',
            firstName: '',
            lastName: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            modalShowing: false,
            error: null,
            success: null,
            loading: false,
            isNurseFlag: '0',
            vanityPhone: '',
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async () => {
        try {
            const username = await AsyncStorage.getItem('@SuperStore:username')
            const emailaddress = await AsyncStorage.getItem('@SuperStore:email')
            const phone = await AsyncStorage.getItem('@SuperStore:phoneNumber')
            const firstName = await AsyncStorage.getItem('@SuperStore:firstName')
            const lastName = await AsyncStorage.getItem('@SuperStore:lastName')
            const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse')
            this.setState({username, emailaddress, phone, firstName, lastName, isNurseFlag})

            if (isNurseFlag === '1') {
                const response = await fetch(`${portalUrl}/my_vehicle/${username}.json`);
                const json = await response.json();
                this.setState({vanityPhone: (json.nurse && json.nurse.phone_number || '')});
            } else {
                const address = await AsyncStorage.getItem('@SuperStore:address')
                const city = await AsyncStorage.getItem('@SuperStore:city')
                const state = await AsyncStorage.getItem('@SuperStore:state')
                const zip = await AsyncStorage.getItem('@SuperStore:zip')
                this.setState({address, city, state, zip})
            }
        } catch (error) {
            alert(error);
        }
    }

    async update() {
        if (this.state.firstName.length === 0 || this.state.lastName.length === 0) {
            this.setState({error: 'First Name and Last Name are required', loading: false});
            return;
        }

        if (this.state.isNurseFlag !== '1') {
            if (this.state.address.length === 0 || this.state.city.length === 0 || this.state.state.length === 0 || this.state.zip.length === 0) {
                this.setState({error: 'Address is required', loading: false});
                return;
            }
        }

        if (!EmailValidator.validate(this.state.emailaddress)) {
            this.setState({error: 'Email address is invalid', loading: false});
            return;
        }

        var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{5,6}$/im;
        if (!phoneRe.test(this.state.phone.replace(/\D/g, ""))) {
            this.setState({error: 'Phone Number is invalid', loading: false});
            return;
        }

        try {
            this.setState({loading: true});

            const currentUser = await Auth.currentAuthenticatedUser();

            const response = await Auth.updateUserAttributes(currentUser, {
                email: this.state.emailaddress,
                phone_number: this.state.phone,
                'custom:first_name': this.state.firstName,
                'custom:last_name': this.state.lastName,
                'custom:address': this.state.address,
                'custom:city': this.state.city,
                'custom:state': this.state.state,
                'custom:zip': this.state.zip,
            });

            const oldEmail = await AsyncStorage.getItem('@SuperStore:email');
            await AsyncStorage.setItem('@SuperStore:email', this.state.emailaddress);
            await AsyncStorage.setItem('@SuperStore:phoneNumber', this.state.phone);
            await AsyncStorage.setItem('@SuperStore:firstName', this.state.firstName);
            await AsyncStorage.setItem('@SuperStore:lastName', this.state.lastName);
            await AsyncStorage.setItem('@SuperStore:address', this.state.address);
            await AsyncStorage.setItem('@SuperStore:city', this.state.city);
            await AsyncStorage.setItem('@SuperStore:state', this.state.state);
            await AsyncStorage.setItem('@SuperStore:zip', this.state.zip);
            this.setState({loading: false, success: "Successfully updated profile", error: null});
            console.log(`Update::updateUserAttributes(): Response#1 = ${JSON.stringify(response, null, 2)}`);
            if (oldEmail !== this.state.emailaddress) {
                this.setState({authData: response, modalShowing: true, loading: false});
            }
        } catch (err) {
            console.log(`Update::updateUserAttributes(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({success: null, error: (err.message || err), loading: false});
        }
    }

    async onConfirmSubmitted(token) {
        try {
            this.setState({loading: true});
            const response = await Auth.verifyCurrentUserAttributeSubmit("email", token);
            console.log(`Profile::onConfirmSubmitted(): Response#2 = ${JSON.stringify(response, null, 2)}`);
            this.setState({loading: false});
            this.setState({
                success: "Successfully confirmed email address.",
                error: null,
                loading: false,
                modalShowing: false
            });

        } catch (err) {
            console.log(`Profile::onConfirmSubmitted(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({success: null, error: err.message, loading: false, modalShowing: false});
        }
    }

    async onChangePassword() {
        this.setState({ loading: true });

        try {
            const data = await Auth.forgotPassword(this.state.username);
            console.log(`onPasswordChange::Response#1: ${JSON.stringify(data, null, 2)}`);

            // // If there is a challenge, then show the modal
            if ('CodeDeliveryDetails' in data) {
                this.setState({ user: data, loading: false, modalShowing: true });
            }
            else {
                this.setState({ error: 'Change password process failed to initiate', loading: false });
            }
        } catch (err) {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: (err.message || err), loading: false });
        }
    }

    async onResetSubmitted (token, pass) {
        try {
            this.setState({loading: true});
            const response = await Auth.forgotPasswordSubmit(this.state.username, token, pass);
            console.log(`Profile::onResetSubmitted(): Response#2 = ${JSON.stringify(response, null, 2)}`);
            this.setState({loading: false});
            this.setState({
                success: "Successfully reset password.",
                error: null,
                loading: false,
                modalShowing: false
            });

        } catch (err) {
            console.log(`Profile::onResetSubmitted(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({success: null, error: err.message, loading: false, modalShowing: false});
        }
    }

    async logout() {
        try {
            this.setState({loading: true});
            const response = await Auth.signOut();
            console.log(`Profile::logout(): Response#2 = ${response}`);
            await AsyncStorage.clear();
            this.setState({loading: false, authState: 'signIn'});
            Actions.auth({tabBarVisible: false})
        } catch (err) {
            console.log(`Profile::logout(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({success: null, error: err.message, loading: false});
        }
    }

    render() {
        const errorComponent = this.state.error !== null
            ? <View style={styles.errorContainer}><Text style={styles.error}>{this.state.error}</Text></View>
            : false;

        const successComponent = this.state.success !== null
            ? <View style={styles.successContainer}><Text style={styles.success}>{this.state.success}</Text></View>
            : false;

        const settings = getSettings(this);

        return (
            <Wrapper>
                <StatusBar hidden={true} barStyle="light-content"/>
                {!!this.state.error !== null && errorComponent}
                {!!this.state.success !== null && successComponent}
                <View style={styles.signUpForm}>
                    <ScrollView style={styles.formContainer}>
                        <View style={StyleSheet.flatten([styles.buttonsContainer, {marginBottom: 0}])}>
                            <TouchableOpacity onPress={() => this.onChangePassword()}>
                                <Text style={settings.updatePasswordButton}>{'Change Password'.toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                        <KeyboardAvoidingView keyboardVerticalOffset={50} style={{flex: 1}} behavior='padding'>
                            <IconTextInput {...settings.usernameInput} editable={false} selectTextOnFocus={false}
                                           iconColor={'#888888'}/>
                            <IconTextInput {...settings.firstNameInput}/>
                            <IconTextInput {...settings.lastNameInput}/>
                            <IconTextInput {...settings.emailInput}/>
                            {!!this.state.isNurseFlag === '1' &&
                            <View>
                                <IconTextInput {...settings.phoneInput}/>
                                <IconTextInput {...settings.vanityPhoneInput} editable={false} selectTextOnFocus={false}
                                               iconColor={'#888888'}/>
                                <Text style={styles.attr}>{'* Vanity Phone Number (Readonly)'.toUpperCase()}</Text>
                            </View>
                            }
                            {this.state.isNurseFlag === '0' &&
                            <View>
                                <IconTextInput {...settings.phoneInput}/>
                                <IconTextInput {...settings.addressInput}/>
                                <IconTextInput {...settings.cityInput}/>
                                <IconTextInput {...settings.stateInput}/>
                                <IconTextInput {...settings.zipInput}/>
                            </View>
                            }
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => this.update()}>
                        <Text style={{...settings.submitButtonInverse, color: '#00b5ec'}}>{'Update'.toUpperCase()}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.logout()}>
                        <Text style={{...settings.submitButtonInverse, color: '#00b5ec'}}>{'Logout'.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
                <ModalTokenInput {...settings.passwordChangePrompt}/>
            </Wrapper>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Profile);
