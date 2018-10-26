import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Button, List, ListItem } from 'react-native-elements';
import { AsyncStorage, View, FlatList, Image, Text, StatusBar, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import styles from './styles';
import portalUrl from '../../config/portalUrl';
import forSubtitle from '../../config/forSubtitle';

class Drips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      title: 'My Drips',
      isNurseFlag: '0',
      username: ''
    }
  }

  componentDidMount() {
    this.fetchDripData();
  }

  fetchDripData = async () => {
    try {
      const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse');
      const username = await AsyncStorage.getItem('@SuperStore:username');
      this.setState({isNurseFlag, username});

      if (isNurseFlag == '1') {
        this.setState({title: 'Today\'s Order Queue'});
        this.requestsForNurse();
      } else {
        this.requestsForUser();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async requestsForNurse() {
    try {
      const response = await fetch(`${portalUrl}/requests/${this.state.username}.json`);
      const json = await response.json();
      this.setState({ data: json.requests });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async requestsForUser() {
    try {
      const response = await fetch(`${portalUrl}/my_requests/${this.state.username}.json`);
      const json = await response.json();
      this.setState({ data: json.results });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }



  render() {
    const { data } = this.state;

    return (
        <View>
          <StatusBar hidden={true} barStyle="light-content" />
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('./ui/assets/background.jpg')}/>
            <Text style={styles.title}>{ this.state.title }</Text>
          </View>
          <View style={styles.innerContainer}>
          {!!Object.keys(data).length === 0 ?
            <View>
              <Text style={styles.subtitle}>{ 'None' }</Text>
            </View>
            : null
          }
          {!!Object.keys(data).length > 0 ?
            <View>
                <List>
                  <FlatList
                    data={data.reverse()}
                    keyExtractor={item => item.confirmation_code}
                    renderItem={({ item }) => (
                      <ListItem
                        title={`${item.product}`}
                        subtitle={forSubtitle(item, this.state.isNurseFlag)}
                        roundAvatar={false}
                        avatar={require('../Services/ui/assets/icon.jpg')}
                        onPress={() => Actions.drip({ item })}
                        hideChevron={true}
                      />
                    )}
                  />
                </List>
              </View>
              : null
          }
          </View>
        </View>

    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(Drips);
