import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import IconTextInput from './ui/IconTextInput';
import ModalTokenInput from './ui/ModalTokenInput';
import Wrapper from './ui/Wrapper';
import { Button } from 'react-native-elements';
import portalUrl from '../../config/portalUrl';

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
    notice: {
        backgroundColor: 'green',
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 8,
        paddingRight: 8,
        textAlign: 'center'
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


class ForgotUsername extends React.Component {
    static defaultProps = {
        authData: {},
        authState: 'forgotUsername',
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
            email: '',
            notice: null,
        };
    }

    async onSubmitForm() {
      try {
        if (this.state.email.length === 0) {
          this.setState({ error: 'Please provide a valid email address' });
          return;
        }
        this.setState({ loading: true });

        const response = await fetch(`${portalUrl}/frontgate`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.state.email
          })
        });

        const json = await response.json();
        this.setState({ notice: json.status });

        console.log(`ForgotUsername::onSubmitForm(): Response#1 = ${JSON.stringify(response, null, 2)}`);

        this.setState({ loading: false, error: null });
      } catch (err) {
        console.log(`ForgotUsername::onSubmitForm(): Error ${JSON.stringify(err, null, 2)}`);
        this.setState({ error: err.message, loading: false });
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
            emailInput: {
                iconColor: '#19bec1',
                iconName: 'user',
                iconSize: 24,
                autoCorrect: false,
                autoCapitalize: 'none',
                returnKeyType: 'next',
                placeholder: 'Email',
                placeholderTextColor: '#404040',
                value: this.state.email,
                onChangeText: (text) => this.setState({ email: text.toLowerCase() })
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
        const noticeComponent = this.state.notice !== null
            ? <View style={styles.errorContainer}><Text style={styles.notice}>{this.state.notice}</Text></View>
            : false;

        return (
            <Wrapper>
                {this.state.error !== null && errorComponent}
                {this.state.notice !== null && noticeComponent}
                <View style={styles.signUpForm}>
                    <View style={styles.formContainer}>
                        <IconTextInput {...settings.emailInput}/>
                        <View style={styles.submissionContainer}>
                          <TouchableOpacity onPress={() => this.onSubmitForm()}>
                            <Text style={settings.submitButton}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Recover Username'.toUpperCase() }</Text>
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

export default ForgotUsername;
