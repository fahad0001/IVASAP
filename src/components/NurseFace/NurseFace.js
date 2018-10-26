import React, { Component } from 'react';

import { AsyncStorage, View, ScrollView, Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import portalUrl from '../../config/portalUrl';

class NurseFace extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
        nurse: {},
    };
  }

  componentDidMount() {
    this.setState({nurse: this.props.nurse, loading: false });
  }

  render() {
    const { nurse } = this.state;

    return (
      <View>
          {!!Object.keys(nurse).length > 0 &&
            <View>
              {!!Object.keys(nurse.picture).length > 0 &&
                <Image style={styles.image_circle} source={{ uri: nurse.picture.url }}/>
              }
              <Text style={styles.attr}>{ `Your Nurse: ${nurse.first_name} ${nurse.last_name}` }</Text>
              {!!nurse.phone_number &&
                <Text style={styles.attr}>{ `Phone Number: ${nurse.phone_number}` }</Text>
              }
            </View>
          }
      </View>
    );
  }
}

export default NurseFace;
