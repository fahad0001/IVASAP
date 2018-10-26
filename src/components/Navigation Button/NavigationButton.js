import React, { Component } from 'react';
import styles from './styles';
import { Button } from 'react-native';
import { connect } from 'react-redux';

const NavigationButton = props => (
  <Button
    onPress={props.onPress}
    title={props.title}
  />
);

export default NavigationButton;
