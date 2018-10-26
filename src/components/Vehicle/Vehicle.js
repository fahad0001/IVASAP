import React, { Component } from 'react';

import { AsyncStorage, View, ScrollView, Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import portalUrl from '../../config/portalUrl';

class Vehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        username: '',
        data: {},
        nurse: {},
        notice: '',
    };
  }

  componentDidMount() {
    this.fetchVehicle();
  }

  fetchVehicle = async () => {
    try {
      const username = await AsyncStorage.getItem('@SuperStore:username');
      this.setState({ username });

      const response = await fetch(`${portalUrl}/my_vehicle/${username}.json`);
      const json = await response.json();
      this.setState({ data: json.vehicle, nurse: json.nurse });
    } catch (error) {
      alert(error);
    }
  }

  render() {
    const noticeComponent = this.state.notice !== null
        ? <View style={styles.noticeContainer}><Text style={styles.attr}>{this.state.notice}</Text></View>
        : false;
    const { data, nurse } = this.state;


    return (
      <View>
        <ScrollView>
          <StatusBar hidden={true} barStyle="light-content" />
          { Object.keys(data).length === 0 &&
            <View>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: 'http://ivasap.com/wp-content/uploads/2017/12/flu_02.jpg' }}/>
                <Text style={styles.title}>My Vehicle</Text>
              </View>
              <View style={styles.innerContainer}>
                <View>
                  <Text style={styles.attr}>{ `None` }</Text>
                  <Text style={styles.attr}>{ `To update your assigned vehicle please contact your administrator and request a change in the portal.` }</Text>
                </View>
              </View>
            </View>
          }
          { Object.keys(data).length > 0 &&
            <View>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: 'http://ivasap.com/wp-content/uploads/2017/12/flu_02.jpg' }}/>
                <Text style={styles.title}>My Vehicle</Text>
              </View>
              <View style={styles.innerContainer}>
                <View>
                  <Image style={styles.image_circle} source={data.picture ? { uri: data.picture.url } : require(`../Services/ui/assets/background.jpg`)}/>
                  <Text style={styles.price}>{ `${data.make} ${data.model}` }</Text>
                  { data && data.refunded === true &&
                    <Text style={styles.price}>{ `Refunded` }</Text>
                  }
                  <Text style={styles.attr}>{ `Year: ${data.year}` }</Text>
                  <Text style={styles.attr}>{ `Color: ${data.color}` }</Text>
                  <Text style={styles.attr}>{ `VIN: ${data.vin}` }</Text>
                  <Text style={styles.attr}>{ `To update your assigned vehicle please contact your administrator and request a change in the portal.` }</Text>

                </View>
              </View>
            </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default Vehicle;
