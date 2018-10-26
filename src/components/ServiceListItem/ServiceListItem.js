import React, { Component } from 'react';

import { AsyncStorage, View, ScrollView, Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import IconTextInput from '../../utils/auth/ui/IconTextInput';

import styles from './styles';

class ServiceListItem extends Component {
  constructor(props) {
      super(props);
      this.state = {
          quantity: '1',
      };
  }

  async addToCart() {
    const qty = parseInt(this.state.quantity);
    if (qty === NaN || qty < 1) {
      return;
    }

    var additional_cart_items = [];
    for (var i = 0; i < qty; i++) {
      additional_cart_items[i] = this.props.item;
    }

    let cart = await AsyncStorage.getItem('@SuperStore:cart');
    cart = JSON.parse(cart);
    cart.push(additional_cart_items)

    var result = [].concat.apply([], cart);

    await AsyncStorage.setItem('@SuperStore:cart', JSON.stringify(result));

    this.setState({notice: "Successfully added item to cart"});
  }

  render() {
    const { item, prevState } = this.props;
    let settings = {
      quantityInput: {
          iconColor: '#19bec1',
          iconName: 'shopping-cart',
          iconSize: 24,
          autoCapitalize: 'none',
          autoCorrect: false,
          returnKeyType: 'next',
          placeholder: 'Quantity',
          placeholderTextColor: '#404040',
          value: this.state.quantity,
          keyboardType: 'numeric',
          maxLength: 10,
          onChangeText: (text) => this.setState({ quantity: text }),
      },
    };
    const noticeComponent = this.state.notice !== null
        ? <View style={styles.noticeContainer}><Text style={styles.attr_bold}>{this.state.notice}</Text></View>
        : false;
    return (
      <View>
        <ScrollView>
          <StatusBar hidden={true} barStyle="light-content" />
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={ item.image_url ? { uri: item.image_url } : require(`../Services/ui/assets/background.jpg`)}/>
            <Text style={styles.title}>{ item.name }</Text>
          </View>
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.price}>{ `$${parseFloat(item.price).toFixed(2)}` }</Text>
              <IconTextInput {...settings.quantityInput} />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => { this.addToCart(); }}>
                <Text style={styles.submitButton}>{ 'Add To Cart'.toUpperCase() }</Text>
              </TouchableOpacity>
            </View>
            <View>
              {!!this.state.notice !== null && noticeComponent}
            </View>

            <View>
              <Text style={styles.subTitle}>{ 'Description'.toUpperCase() }</Text>
              <Text style={styles.description}>{ item.description }</Text>
            </View>
            <View>
              <Text style={styles.subTitle}>{ 'Formula'.toUpperCase() }</Text>
              <Text style={styles.formula}>{ item.formula }</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={prevState}>
                <Text style={styles.submitButton}>{ 'Back'.toUpperCase() }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ServiceListItem;
