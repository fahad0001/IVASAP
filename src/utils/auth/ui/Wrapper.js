import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    imageContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    topContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        top: '5%',
        left: '-2%'
    },
    logo: {
        height: 60,
        width: 206
    }
});

const Wrapper = (props) => {
    return (
        <View style={styles.container}>
            <StatusBar hidden={true} barStyle="light-content" />
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('./assets/background.jpg')}/>
            </View>
            <View style={styles.innerContainer}>
                <View style={styles.topContainer}>
                    <Image style={styles.logo} source={require('./assets/logo.png')}/>
                </View>
                {props.children}
            </View>
        </View>
    );
};

export default Wrapper;
