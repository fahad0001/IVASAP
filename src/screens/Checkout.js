import React, { Component } from 'react';
import { Container } from '../components/Container';
import { ConfirmationScreen } from '../components/Confirmation Screen';
import { connect } from 'react-redux';
import { AsyncStorage, View, Text} from 'react-native';


class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.webView = null;

    this.state = {
      loading: true,
      cart: [],
      username: '',
      emailaddress: '',
      phone: '',
      firstName: '',
      lastName: '',
      customerId: '',
      address: '',
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const username = await AsyncStorage.getItem('@SuperStore:username')
    const emailaddress = await AsyncStorage.getItem('@SuperStore:email')
    const phone = await AsyncStorage.getItem('@SuperStore:phoneNumber')
    const firstName = await AsyncStorage.getItem('@SuperStore:firstName')
    const lastName = await AsyncStorage.getItem('@SuperStore:lastName')
    const customerId = await AsyncStorage.getItem('@SuperStore:customerId')
    const address = await AsyncStorage.getItem('@SuperStore:address')
    let cart = await AsyncStorage.getItem('@SuperStore:cart');

    cart = JSON.parse(cart);
    this.setState({ cart, username, emailaddress, phone, firstName, lastName, customerId, address, loading: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading === false) {
      console.log("got it");
    }
  }

  render() {
    return (
      <Container>
        {!!this.state.loading === false &&
          <ConfirmationScreen data={ this.state } />
        }
        {!!this.state.loading !== false &&
          <View>
            <Text>{ 'Loading...' }</Text>
          </View>
        }
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(CheckoutScreen);
