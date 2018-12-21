const settings = (_that) => {
  return {
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
        isVisible: _that.state.modalShowing,
        title: 'Confirmation Required',
        description: 'Check your text messages for the code. Enter the six digit code you were just sent',
        onSubmit: (token) => _that.onConfirmSubmitted(token)
    },
    passwordChangePrompt : {
        isVisible: _that.state.modalShowing,
        title: 'Confirmation Required',
        description: 'Check your text messages for the code.',
        tokenTxt: 'Enter the six digit token',
        passTxt: 'Enter new password',
        onSubmit: (token, pass) => _that.onResetSubmitted(token, pass)
    },
    usernameInput: {
        iconColor: '#19bec1',
        iconName: 'user',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'Username',
        placeholderTextColor: '#404040',
        value: _that.state.username,
        onChangeText: (text) => _that.setState({ username: text })
    },
    firstNameInput: {
        iconColor: '#19bec1',
        iconName: 'user',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'First Name',
        placeholderTextColor: '#404040',
        width: '50%',
        value: _that.state.firstName,
        onChangeText: (text) => _that.setState({ firstName: text })
    },
    lastNameInput: {
        iconColor: '#19bec1',
        iconName: 'user',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'Last Name',
        placeholderTextColor: '#404040',
        value: _that.state.lastName,
        onChangeText: (text) => _that.setState({ lastName: text })
    },
    addressInput: {
        iconColor: '#19bec1',
        iconName: 'home',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'Address',
        placeholderTextColor: '#404040',
        value: _that.state.address,
        onChangeText: (text) => _that.setState({ address: text })
    },
    cityInput: {
        iconColor: '#19bec1',
        iconName: 'home',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'City',
        placeholderTextColor: '#404040',
        value: _that.state.city,
        onChangeText: (text) => _that.setState({ city: text }),
    },
    stateInput: {
        masked: false,
        iconColor: '#19bec1',
        iconName: 'home',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'State',
        placeholderTextColor: '#404040',
        value: _that.state.state,
        disabled: true,
        onChangeText: (text) => _that.setState({ state: text }),
    },
    zipInput: {
        iconColor: '#19bec1',
        iconName: 'home',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'Zip',
        placeholderTextColor: '#404040',
        value: _that.state.zip,
        onChangeText: (text) => _that.setState({ zip: text })
    },
    passwordInput: {
        iconColor: '#19bec1',
        iconName: 'lock',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'done',
        secureTextEntry: true,
        placeholder: 'Password',
        placeholderTextColor: '#404040',
        value: _that.state.password,
        onChangeText: (text) => _that.setState({ password: text })
    },
    emailInput: {
        iconColor: '#19bec1',
        iconName: 'envelope',
        iconSize: 18,
        autoCorrect: false,
        autoCapitalize: 'none',
        returnKeyType: 'next',
        placeholder: 'Email Address',
        placeholderTextColor: '#404040',
        value: _that.state.emailaddress,
        onChangeText: (text) => _that.setState({ emailaddress: text.toLowerCase() })
    },
    phoneInput: {
        iconColor: '#19bec1',
        iconName: 'phone',
        iconSize: 20,
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        returnKeyType: 'next',
        placeholder: 'Phone',
        masked: true,
        maskType: 'custom',
        maskOptions: {
          mask: '+1 999-999-9999',
        },
        placeholderTextColor: '#404040',
        value: _that.state.phone,
        onChangeText: (text) => _that.setState({ phone: text.replace(/\s/g, '').replace(/-/g, '') })
    },
    vanityPhoneInput: {
        iconColor: '#19bec1',
        iconName: 'phone',
        iconSize: 20,
        autoCorrect: false,
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        returnKeyType: 'next',
        placeholder: 'Vanity Phone (Admin Portal)',
        masked: true,
        maskType: 'custom',
        maskOptions: {
          mask: '+1 999-999-9999',
        },
        editable: false,
        selectTextOnFocus: false,
        placeholderTextColor: '#404040',
        value: _that.state.vanityPhone,
        onChangeText: (text) => _that.setState({ vanityPhone: text.replace(/\s/g, '').replace(/-/g, '') })
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
        marginTop: -30,
    },
    submitButton: {
      borderRadius: 21,
      borderWidth: 2,
      borderColor: '#45e8eb',
      width: 200,
      height: 42,
      padding: 10,
      alignSelf: 'center',
      textAlign: 'center',
      color: '#19bec1',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    submitButtonInverse: {
      borderRadius: 21,
      borderWidth: 2,
      borderColor: '#45e8eb',
      width: 120,
      height: 42,
      padding: 10,
      marginRight: 10,
      alignSelf: 'center',
      textAlign: 'center',
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 2,
    },
    updatePasswordButton: {
          borderRadius: 21,
          borderWidth: 2,
          borderColor: '#45e8eb',
          width: 200,
          height: 42,
          padding: 10,
          marginRight: 10,
          alignSelf: 'center',
          textAlign: 'center',
          color: '#00b5ec',
          fontSize: 14,
          fontWeight: 'bold',
          letterSpacing: 2,
      }
  };
}

export default settings;
