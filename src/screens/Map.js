import React from 'react';
import { Map } from '../components/Map';
import { View } from 'react-native';
import { RoundButton } from '../components/Round Button';
import { Actions } from 'react-native-router-flux';

class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Map />
      </View>
    )
  }
}

export default MapScreen;
