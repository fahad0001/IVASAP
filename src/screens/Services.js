import React, { Component } from 'react';
import { Container } from '../components/Container';
import { Services } from '../components/Services';
import { connect } from 'react-redux';

class ServicesScreen extends Component {
  render() {
    return (
      <Container>
        <Services />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(ServicesScreen);
