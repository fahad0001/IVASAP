import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { ServiceListItem } from '../components/ServiceListItem';
import { Actions } from 'react-native-router-flux';

class ServiceListItemScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container>
        <ServiceListItem
          {...this.props}
          prevState={() => { Actions.pop() }} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(ServiceListItemScreen);
