import React, { Component } from 'react';

import { AsyncStorage, View, ScrollView, Image, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from './styles';
import portalUrl from '../../config/portalUrl';

class AssignedDrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading: false,
        loading2: false,
        username: '',
        data: {},
        nurse: {},
        notice: '',
        requestIsCancelled: false,
        is_complete_by_nurse: false,
    };
  }

  componentDidMount() {
    this.setState({ data: this.props.item, username: this.props.username, is_complete_by_nurse: this.props.item.is_complete_by_nurse });
  }

  completeOrder = async () => {
    this.setState({ loading2: true });

    const { data, username } = this.state;

    try {
      const response = await fetch(`${portalUrl}/requests/${data.id}/completed_by_nurse`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Code": data.confirmation_code
        },
        body: JSON.stringify({
          request: {
            nurse_username: username
          }
        })
      });

      const json = await response.json();
      this.setState({ notice: json.status, loading2: false, is_complete_by_nurse: json.is_complete_by_nurse });
    } catch (error) {
      alert(error);
    }
  }

  cancelOrder = async () => {
    this.setState({ loading: true });

    const { data } = this.state;

    try {
      const username = await AsyncStorage.getItem('@SuperStore:username');

      const response = await fetch(`${portalUrl}/requests/${data.id}/unassign`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Code": data.confirmation_code
        },
        body: JSON.stringify({
          request: {
            nurse_username: username,
            cancelled_by: 'nurse'
          }
        })
      });

      const json = await response.json();
      this.setState({ notice: json.status, loading: false, requestIsCancelled: true });
    } catch (error) {
      alert(error);
    }
  }

  prevState() {
    Actions.nurse_assignments();
  }

  render() {
    const noticeComponent = this.state.notice !== null
        ? <View style={styles.noticeContainer}><Text style={styles.attr}>{this.state.notice}</Text></View>
        : false;
    const { data } = this.state;

    return (
      <View>
        <ScrollView>
          <StatusBar hidden={true} barStyle="light-content" />
          {!!Object.keys(data).length > 0 &&
            <View>
              <View style={styles.imageContainer}>
                <Image style={styles.image} source={{ uri: 'http://ivasap.com/wp-content/uploads/2017/12/muscle_02.jpg?id=1006' }}/>
                <Text style={styles.title}>{ data.product }</Text>
              </View>
              <View style={styles.innerContainer}>
                <View>
                  <Text style={styles.price}>{ `$${parseFloat(data.amount).toFixed(2)}` }</Text>
                  <Text style={styles.price}>{ `Confirmation Code: ${data.confirmation_code}` }</Text>
                  {!!data && data.refunded === true &&
                    <Text style={styles.price}>{ `Refunded` }</Text>
                  }
                  <Text style={styles.attr}>{ `Area: ${data.location}` }</Text>
                  <Text style={styles.attr}>{ `Address: ${data.street_address}` }</Text>
                  <Text style={styles.attr}>{ `Appointment Date: ${data.start_date} ${data.start_time}` }</Text>
                  <Text style={styles.attr}>{ `Customer Name: ${data.first_name} ${data.last_name}` }</Text>
                  <Text style={styles.attr}>{ `Phone Number: ${data.phone}` }</Text>
                  {!!data.nurse_id !== null && data.refunded !== true && data.is_complete_by_nurse !== true &&
                    <Text style={styles.attr_bold}>{ `You Have Accepted The Appointment.` }</Text>
                  }
                  {!!data.nurse_id !== null && data.refunded !== true && data.is_complete_by_nurse === true &&
                    <Text style={styles.attr_bold}>{ `You Have Completed The Appointment.` }</Text>
                  }
                  {!!data.refunded === true &&
                    <Text style={styles.attr_bold}>{ `This order has been refunded.` }</Text>
                  }
                  {!!this.state.notice !== null && noticeComponent}
                </View>
                  {!!data && data.refunded !== true && this.state.is_complete_by_nurse !== true && this.state.requestIsCancelled !== true &&
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity disabled={this.state.loading2} onPress={() => { this.completeOrder() }}>
                        <Text style={styles.submitButton}>{ this.state.loading2 ? 'Please Wait'.toUpperCase() : 'Confirm Order Is Complete'.toUpperCase() }</Text>
                      </TouchableOpacity>
                    </View>
                  }
                  {!!data && data.refunded !== true && this.state.is_complete_by_nurse !== true && this.state.requestIsCancelled !== true &&
                    <TouchableOpacity disabled={this.state.loading} onPress={() => { this.cancelOrder() }}>
                      <Text style={styles.submitButton2}>{ this.state.loading ? 'Please Wait'.toUpperCase() : 'Unassign Myself'.toUpperCase() }</Text>
                    </TouchableOpacity>
                  }

                  <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={() => { this.prevState()}}>
                      <Text style={styles.submitButton3}>{ 'Back'.toUpperCase() }</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
          }


        </ScrollView>
      </View>
    );
  }
}

export default AssignedDrip;
