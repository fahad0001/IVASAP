import React, { Component } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Router, Scene, Button } from 'react-native-router-flux';
import { Actions } from 'react-native-router-flux';
import { AsyncStorage, Text, View, PixelRatio } from 'react-native';
import { Provider } from 'react-redux';
import store from './config/store';

import Icon from 'react-native-vector-icons/Feather';

import Map from './screens/Map';
import Services from './screens/Services';
import ServiceListItem from './screens/ServiceListItem';
import Profile from './screens/Profile';
import BookService from './screens/BookService';
import Drips from './screens/Drips';
import Checkout from './screens/Checkout';
import DripListItem from './screens/DripListItem';
import AssignedDrip from './screens/AssignedDrip';
import Assignments from './screens/Assignments';
import Vehicle from './screens/Vehicle';
import Authenticator from './utils/auth/Authenticator';

EStyleSheet.build({
  $primaryBlue: '#61D4D5',
  $white: '#FFFFFF',
  $border: '#E2E2E2',
  $inputText: '#797979',
  $lightGrey: '#F0F0F0',
  $logoTextColor: '#FFFFFF',
  $darkText: '#343434',
  $loginButtonText: '#371B92',
  $darkGrey: '#818181',
  $aqua: '#33b3b6',
});

class TabIcon extends Component {
  render() {
    var color = this.props.selected ? '#00f240' : '#301c2a';
    return (
      <View style={{width: 30, height: 30, alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
        <Icon style={{color: color}} name={this.props.iconName || "circle"} size={18}/>
      </View>
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="home">
            <Scene key="user">
              <Scene
                key="rootTabBar"
                tabs={true}
                lazy={true}
                tabBarVisible={this.props.tabBarVisible}
                tabBarPosition="bottom"
                tabBarStyle={{borderTopColor: 'darkgrey', borderTopWidth: 1 / PixelRatio.get(), backgroundColor: 'ghostwhite',  opacity: 0.98}}>
                <Scene key="map" component={Map} title="Map" showTitle={false} hideNavBar={true} icon={TabIcon} iconName="map"  />
                <Scene key="services" component={Services} title="Formulas" hideNavBar={true} icon={TabIcon} iconName="shopping-cart" onEnter={() => { Actions.refresh({key: Math.random()}); }} />
                <Scene key="drips" component={Drips} title="My Drips" hideNavBar={true} icon={TabIcon} iconName="droplet" onEnter={() => { Actions.refresh({key: Math.random()}); }} />
                <Scene key="checkout" component={Checkout} title="Checkout" hideNavBar={true} icon={TabIcon} iconName="check-circle" onEnter={() => { Actions.refresh({key: Math.random()}); }} />
                <Scene key="profile" component={Profile} title="My Profile" hideNavBar={true} icon={TabIcon} iconName="user" onEnter={() => { Actions.refresh({key: Math.random()}, tabBarVisible: false); }} />
              </Scene>
              <Scene key="drip" component={DripListItem} title="" hideNavBar={true}  />
              <Scene key="service" component={ServiceListItem} title="" hideNavBar={true} />
              <Scene key="confirm" component={BookService} title="" hideNavBar={true} />
              <Scene key="auth" component={Authenticator} title="" initial={true} hideNavBar={true} />
            </Scene>
            <Scene key="nurse">
              <Scene
                key="rootTabBar2"
                tabs={true}
                lazy={true}
                tabBarVisible={this.props.tabBarVisible}
                tabBarPosition="bottom" 
                tabBarStyle={{borderTopColor: 'darkgrey', borderTopWidth: 1 / PixelRatio.get(), backgroundColor: 'ghostwhite',  opacity: 0.98}}>
                <Scene key="nurse_map" component={Map} title="Map" showTitle={false} hideNavBar={true} icon={TabIcon} iconName="map"  />
                <Scene key="nurse_assignments" component={Assignments} title="Appointments" hideNavBar={true} icon={TabIcon} iconName="calendar" onEnter={() => { Actions.refresh({key: Math.random()}); }} />
                <Scene key="nurse_drips" component={Drips} title="Order Queue" hideNavBar={true} icon={TabIcon} iconName="droplet" onEnter={() => { Actions.refresh({key: Math.random()}); }} />
                <Scene key="nurse_vehicle" component={Vehicle} title="My Vehicle" hideNavBar={true} icon={TabIcon} iconName="compass" onEnter={() => { Actions.refresh({key: Math.random()}); }} />
                <Scene key="nurse_profile" component={Profile} title="My Profile" hideNavBar={true} icon={TabIcon} iconName="user" onEnter={() => { Actions.refresh({key: Math.random(), tabBarVisible: false}); }} />
              </Scene>
              <Scene key="nurse_drip" component={DripListItem} title="" hideNavBar={true}  />
              <Scene key="nurse_assigned_drip" component={AssignedDrip} title="" hideNavBar={true}  />
              </Scene>
            </Scene>
        </Router>
      </Provider>
    );
  }
}
