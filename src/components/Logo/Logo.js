import React from 'react';
import { Text, ImageBackground } from 'react-native';
import styles from './styles';

const Logo = () => (
  <ImageBackground
    style={styles.container}
    source={require('./images/HP-Hero-BG-trim.jpg')}
  >
    <ImageBackground
      style={styles.logo}
      resizeMode="contain"
      source={require('./images/Logo.png')}
    />
  </ImageBackground>
);

export default Logo;
