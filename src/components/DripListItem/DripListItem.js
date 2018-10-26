import React, { Component } from 'react';

import { AsyncStorage, View, ScrollView, Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import portalUrl from '../../config/portalUrl';
import { NurseFace } from '../NurseFace';

class DripListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
        notice: '',
        refunded: false,
        isNurseFlag: '0',
        requestIsAssigned: false,
        requestIsCancelled: false
    };
  }

  componentDidMount() {
    this.fetchData();
    this.setState({refunded: this.props.refunded, loading: false });
  }

  fetchData = async () => {
    try {
      const isNurseFlag = await AsyncStorage.getItem('@SuperStore:isNurse');
      this.setState({ isNurseFlag });
    } catch (error) {
      alert(error);
    }
  }

  refundOrder = async () => {
    this.setState({ loading: true });

    const { item } = this.props;

    try {
      const response = await fetch(`${portalUrl}/requests/${item.id}/refund`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Code": item.confirmation_code
        }
      });

      const json = await response.json();
      this.setState({ notice: json.status, loading: false, refunded: true });
    } catch (error) {
      alert(error);
    }
  }

  acceptOrder = async () => {
    this.setState({ loading: true });

    const { item } = this.props;

    try {
      const username = await AsyncStorage.getItem('@SuperStore:username');

      const response = await fetch(`${portalUrl}/requests/${item.id}/assign_nurse`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Code": item.confirmation_code
        },
        body: JSON.stringify({
          request: {
            nurse_username: username
          }
        })
      });

      const json = await response.json();
      this.setState({ notice: json.status, loading: false, requestIsAssigned: true, requestIsCancelled: false });
    } catch (error) {
      alert(error);
    }
  }

  cancelOrder = async () => {
    this.setState({ loading: true });

    const { item } = this.props;

    try {
      const username = await AsyncStorage.getItem('@SuperStore:username');

      const response = await fetch(`${portalUrl}/requests/${item.id}/unassign_nurse`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Code": item.confirmation_code
        },
        body: JSON.stringify({
          request: {
            nurse_username: username,
            cancelled_by: 'customer'
          }
        })
      });

      const json = await response.json();
      this.setState({ notice: json.status, loading: false, requestIsAssigned: false, requestIsCancelled: true });
    } catch (error) {
      alert(error);
    }
  }


  prevState() {
    if (this.state.isNurseFlag === '1') {
      if (this.state.requestIsAssigned) {
        Actions.nurse_assignments();
      } else {
        Actions.nurse_drips();
      }
    } else {
      Actions.drips();
    }
  }

  render() {
    const { item } = this.props;
    const noticeComponent = this.state.notice !== null
        ? <View style={styles.noticeContainer}><Text style={styles.attr_bold}>{this.state.notice}</Text></View>
        : false;

    return (
      <View>
        <ScrollView>
          <StatusBar hidden={true} barStyle="light-content" />
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: 'http://ivasap.com/wp-content/uploads/2017/12/muscle_02.jpg?id=1006' }}/>
            <Text style={styles.title}>{ item.product }</Text>
          </View>
          <View style={styles.innerContainer}>
            <View>
              <Text style={styles.price}>{ `$${parseFloat(item.amount).toFixed(2)}` }</Text>
              <Text style={styles.price}>{ `Confirmation Code: ${item.confirmation_code}` }</Text>
              <Text style={styles.attr}>{ `Area: ${item.location}` }</Text>
              <Text style={styles.attr}>{ `Address: ${item.street_address}` }</Text>
              <Text style={styles.attr}>{ `Appointment Date: ${item.start_date} ${item.start_time}` }</Text>
              {!!this.state.loading === false && this.state.isNurseFlag === '0' && item.nurse_id === null && item.refunded !== true &&
                <Text style={styles.attr_bold}>{ `This Appointment is pending acceptance from one of our nurses.` }</Text>
              }
              {!!this.state.isNurseFlag === '0' && item.refunded === true &&
                <Text style={styles.attr_bold}>{ `This order has been refunded.` }</Text>
              }
              {!!this.state.isNurseFlag === '0' && item.nurse_id !== null && item.refunded !== true && item.is_complete_by_nurse !== true &&
                <Text style={styles.attr_bold}>{ `Your Nurse Has Accepted The Appointment.` }</Text>
              }
              {!!this.state.isNurseFlag === '0' && item.nurse_id !== null && item.refunded !== true && item.is_complete_by_nurse === true &&
                <Text style={styles.attr_bold}>{ `Your Nurse Completed The Appointment.` }</Text>
              }
              {!!this.state.isNurseFlag === '0' && item.nurse_id !== null &&
                <NurseFace nurse={{...item.nurse}} />
              }
              {this.state.notice !== null && noticeComponent}

            </View>
            <View style={styles.buttonsContainer}>
            {!!item && this.state.loading === false && this.state.refunded !== true && this.state.isNurseFlag === '0' && item.refunded !== true && item.is_complete_by_nurse !== true &&
              <TouchableOpacity disabled={this.state.loading} onPress={() => { this.refundOrder() }}>
                <Text style={styles.submitButton2}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Cancel Order'.toUpperCase() }</Text>
              </TouchableOpacity>
            }
            {!!item && this.state.refunded !== true && this.state.isNurseFlag === '1' && this.state.requestIsAssigned !== true &&
              <TouchableOpacity disabled={this.state.loading} onPress={() => { this.acceptOrder() }}>
                <Text style={styles.submitButton}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Accept Order'.toUpperCase() }</Text>
              </TouchableOpacity>
            }
            </View>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => { this.prevState()}}>
                <Text style={styles.submitButton}>{ 'Back'.toUpperCase() }</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default DripListItem;
