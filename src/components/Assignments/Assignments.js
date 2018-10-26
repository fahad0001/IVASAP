import React, { Component } from 'react';

import { AsyncStorage, FlatList, View, ScrollView, Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Button, List, ListItem } from 'react-native-elements';

import { Actions } from 'react-native-router-flux';
import styles from './styles';
import portalUrl from '../../config/portalUrl';
import forSubtitle from '../../config/forSubtitle';

class Assignments extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        username: '',
        data: [],
        nurse: {},
        notice: '',
        isNurseFlag: false
    };
  }

  componentDidMount() {
    this.fetchAssignments();
  }

  fetchAssignments = async () => {
    try {
      const username = await AsyncStorage.getItem('@SuperStore:username');
      const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse');
      this.setState({ username, isNurseFlag });

      if (isNurseFlag === '1') {
        const response = await fetch(`${portalUrl}/requests/assignments/${username}.json`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
        });
        const json = await response.json();
        this.setState({ data: json.requests, nurse: json.nurse });
      }
    } catch (error) {
      alert(error);
    }
  }

  render() {
    const noticeComponent = this.state.notice !== null
        ? <View style={styles.noticeContainer}><Text style={styles.attr}>{this.state.notice}</Text></View>
        : false;
    const { data, nurse, username } = this.state;

    return (
      <View>
        <ScrollView>
          <StatusBar hidden={true} barStyle="light-content" />

            <View>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: 'http://ivasap.com/wp-content/uploads/2017/12/muscle_02.jpg?id=1006' }}/>
                <Text style={styles.title}>{ 'My Appointments' }</Text>
              </View>
              <View style={styles.innerContainer}>
              {!!Object.keys(data).length === 0 &&
                <View>
                  <Text style={styles.attr}>{ `None` }</Text>
                </View>
              }
              {!!Object.keys(data).length > 0 &&
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
                            onPress={() => Actions.nurse_assigned_drip({ item, username })}
                            hideChevron={true}
                          />
                        )}
                      />
                    </List>
                  </View>
              }
              </View>
            </View>
        </ScrollView>
      </View>
    );
  }
}

export default Assignments;
