import React, { Component } from 'react';
import { MapView } from 'expo';
import styles from './styles';
import { AsyncStorage, Alert, Platform, Dimensions, View } from 'react-native';
import {
  getUsersInitialLocation,
  getNearbyNurses,
} from '../../actions/locations';
import { connect } from 'react-redux';
import nurseCar from './images/carMarker.png';
import ip from '../../data/localip';

const { Marker } = MapView;

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO    = width / height;
const LATITUDE        = 31.161111;
const LONGITUDE       = -81.386944;
const LATITUDE_DELTA  = 0.0122;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE           = 0.01;

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      marginBottom: 1,
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      coordinate: this.props.coordinate,
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            accuracy: position.coords.accuracy
          }
        });
      },
      (error) => alert(error.message),
      {timeout: 30000}
    );

    // setTimeout(() => this.fetchLocation(), 2500);
  }

  fetchLocation = async () => {
    try {
      const username = await AsyncStorage.getItem('@SuperStore:username');
      const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse');

      this.watchId = navigator.geolocation.watchPosition(
        (position) => {

          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
            accuracy: position.coords.accuracy
          };

          const coordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            region,
            coordinate
          });

          let url;

          if (isNurseFlag === '1') {
            url = `https://portal.ivasap.com/nurse_location/${username}?longitude=${
              this.state.longitude
            }&latitude=${this.state.latitude}`;
          }

          fetch(url).then(response =>
            response
              .json()
              .then(data => {
                setTimeout(() => {
                  console.log('yesss')
                }, 2500);
              })
              .catch(err => {
                console.log('yoooo')
                Alert.alert(`Error fetching nurses: ${err.message}`);
                console.log(
                  `Error fetching nurses. Might be related to: ${err.message}`
                );
              })
          );
        },
        (error) => {
          console.log(error.message);
          this.setState({ error: error.message });
        },
        { timeout: 30000, distanceFilter: 10 },
      );
    } catch (error) {
      alert(error);
    }
  };

  shouldComponentUpdate(nextProps) {
      if(this.props.nurseLocation !== nextProps.nurseLocation){
          const location = JSON.parse(JSON.stringify(nextProps.nurseLocation));
          this.setState({
              latitude: location.latitude,
              longitude: location.longitude,
              error: null,
              region: location.region,
              coordinate: location.coordinate
          });
        return true;
      }
      return false;
    }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    const {nurseLocation} = this.props;

    return (
      <MapView
        style={styles.container}
        region={this.state.region}
        provider={null}
        mapType="mutedStandard"
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/*{!!Platform.OS === 'android' ?*/}
          {/*<Marker coordinate={this.state.coordinate} title="My Location" />*/}
          {/*: null*/}
        {/*}*/}

        {!! Object.keys(nurseLocation).length ?
            <Marker
                key={nurseLocation.requestId}
                coordinate={this.state.coordinate}
                image={nurseCar}
            />
            : null
        }

        {!!this.props.nearbyNurses.map(nurse => (
          <Marker
            key={nurse._id}
            coordinate={{
              latitude: nurse.coordinate.coordinates[1],
              longitude: nurse.coordinate.coordinates[0],
            }}
            image={nurseCar}
          />
        ))}
      </MapView>
    )
  }
}

const mapStateToProps = state => {
  const coordinate = state.locations.user.coordinate;
  const nearbyNurses = state.locations.nearbyNurses;
  const nurseLocation = state.locations.nurseLocation;
  return {
    coordinate,
    nearbyNurses,
    nurseLocation
  };
};

export default connect(mapStateToProps)(Map);
