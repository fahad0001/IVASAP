import React, { Component } from 'react';
import { Container } from '../components/Container';
import { Drips } from '../components/Drips';
import { connect } from 'react-redux';

class DripsScreen extends Component {
  render() {
    return (
      <Container>
        <Drips />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(DripsScreen);
