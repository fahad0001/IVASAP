import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { AssignedDrip } from '../components/AssignedDrip';
import { Actions } from 'react-native-router-flux';

class AssignedDripScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <AssignedDrip
          {...this.props}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(AssignedDripScreen);
