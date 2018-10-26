import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, List, ListItem } from 'react-native-elements';
import { View, FlatList, Image, Text, StatusBar } from 'react-native';

import { Actions } from 'react-native-router-flux';

import styles from './styles';
import portalUrl from '../../config/portalUrl';

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: 'Our Formulas'
    }
  }

  componentDidMount() {
    this.fetchData();
  }


  fetchData = async () => {
    try {
      const response = await fetch(`${portalUrl}/formulas.json`);
      const json = await response.json();
      this.setState({ data: json });
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <View>
        <StatusBar hidden={true} barStyle="light-content" />
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('./ui/assets/background.jpg')}/>
        </View>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{ this.state.title }</Text>
          <List>
            <FlatList
              data={this.state.data}
              keyExtractor={item => item.name}
              renderItem={({ item }) => (
                <ListItem
                  title={item.name}
                  subtitle={`$${parseFloat(item.price).toFixed(2)}`}
                  roundAvatar={false}
                  avatar={require('./ui/assets/icon.jpg')}
                  onPress={() => Actions.service({ item })}
                />
              )}
            />
          </List>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(Services);
