import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Vehicle } from '../components/Vehicle';
import { Actions } from 'react-native-router-flux';

class VehicleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Vehicle
          {...this.props}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(VehicleScreen);
