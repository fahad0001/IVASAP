import React, { Component } from 'react';

import { ActivityIndicator, View, ScrollView, WebView, Image, StatusBar, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import { Auth } from 'aws-amplify';

import * as queryString from 'query-string';


const patchPostMessageFunction = function() {
  var originalPostMessage = window.postMessage;

  var patchedPostMessage = function(message, targetOrigin, transfer) {
    originalPostMessage(message, targetOrigin, transfer);
  };

  patchedPostMessage.toString = function() {
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage');
  };

  window.postMessage = patchedPostMessage;
};

const patchPostMessageJsCode = '(' + String(patchPostMessageFunction) + ')();';

class ConfirmationScreen extends Component {
  constructor(props) {
    super(props);
    this.webView = null;
    this.onMessage = this.onMessage.bind(this);

    this.state = {
      goBack: Actions.services,
      goBackText: 'Go Home',
      customerId: '',
    }
  }

  onMessage = async (e) => {
    try {
      if (e.nativeEvent.data === "purchase_success") {
        await AsyncStorage.setItem('@SuperStore:cart', JSON.stringify([]));

        this.setState({ goBack: Actions.drips, goBackText: 'View My Drips' });
      } else if (e.nativeEvent.data.indexOf('customer_id|') > -1) {
        const customerId = e.nativeEvent.data.split("|")[1];

        const currentUser = await Auth.currentAuthenticatedUser();
        const response = await Auth.updateUserAttributes(currentUser, {
          'custom:customer_id': customerId,
        });

        await AsyncStorage.setItem('@SuperStore:customerId', customerId);
        this.setState({customerId});
      }
    } catch (err) {
        console.log(`ConfirmationScreen::updateUserAttributes(): Error ${JSON.stringify(err, null, 2)}`);
    }
  }

  clearCart = async () => {
    await AsyncStorage.setItem('@SuperStore:cart', JSON.stringify([]));
    Actions.drips();
  }

  render() {
    let min_cart = [];

    for (var i = 0; i < this.props.data.cart.length; i++) {
      min_cart[i] = {
        name: this.props.data.cart[i].name,
        price: this.props.data.cart[i].price
      }
    }

    const data = JSON.stringify({
      cart: min_cart,
      username: this.props.data.username,
      emailaddress: this.props.data.emailaddress,
      phone: this.props.data.phone,
      firstName: this.props.data.firstName,
      lastName: this.props.data.lastName,
      customerId: this.props.data.customerId,
      address: this.props.data.address,
    });

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} barStyle="light-content" />
        <WebView
          automaticallyAdjustContentInsets={true}
          source={{
            uri: `https://portal.ivasap.com/stripe?data=${data}`,
            headers: { 'Content-Type': 'application/json' },
            method:'GET'
          }}
          style={styles.webviews}
          injectedJavaScript={patchPostMessageJsCode}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          ref={webview => { this.webview = webview; }}
          onLoad={() => { this.webview.postMessage( JSON.stringify(this.props.data) ); }}
          bounces={false}
          onMessage={this.onMessage}
        />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={() => { this.state.goBack() }}>
            <Text style={styles.submitButton}>{ this.state.goBackText.toUpperCase() }</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.clearCart() }}>
            <Text style={styles.submitButton}>{ 'CLEAR CART' }</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default ConfirmationScreen;
