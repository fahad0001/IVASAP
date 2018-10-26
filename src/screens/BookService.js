import React, { Component } from 'react';
import { Container } from '../components/Container';
import { ConfirmationScreen } from '../components/Confirmation Screen';
import { connect } from 'react-redux';

class BookServiceScreen extends Component {
  render() {
    const { name, description, formula, price, image_url } = this.props.navigation.state.params;

    return (
      <Container>
        <ConfirmationScreen item={{ name, description, formula, price, image_url }} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

export default connect(mapStateToProps)(BookServiceScreen);
