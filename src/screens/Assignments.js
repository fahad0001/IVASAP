import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Assignments } from '../components/Assignments';
import { Actions } from 'react-native-router-flux';

class AssignmentsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <Assignments
          {...this.props}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(AssignmentsScreen);
