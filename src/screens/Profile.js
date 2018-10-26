import React, { Component } from 'react';
import { Container } from '../components/Container';
import { Profile } from '../components/Profile';
import { connect } from 'react-redux';

class ProfileScreen extends Component {
  render() {
    return (
      <Container>
        <Profile />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(ProfileScreen);
