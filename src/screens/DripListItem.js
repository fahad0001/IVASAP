import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { DripListItem } from '../components/DripListItem';
import { Actions } from 'react-native-router-flux';

class DripListItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <DripListItem
          {...this.props}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(DripListItemScreen);
