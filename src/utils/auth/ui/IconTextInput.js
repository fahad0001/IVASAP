import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TextInputMask } from 'react-native-masked-text'

const styles = {
    container: {
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: 2,
        marginBottom: 12
    },
    errorContainer: {
        borderBottomColor: 'red',
        borderBottomWidth: 2
    },
    noErrorContainer: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    textInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 12,
        color: '#818181',
    },
};

class IconTextInput extends React.Component {
    static defaultProps = {
        iconName: 'user',
        iconColor: '#19bec1',
        iconSize: 24,
        isError: false,
        style: {},
        inputStyle: {},
        masked: false,
        maskFormat: null,
        maskType: null,
        maskRef: null,
        maskOptions: {},
        underlineColorAndroid: "rgba(0,0,0,0)"
    };

    render() {
        const { iconName, iconColor, iconSize, isError, style, inputStyle, ...props } = this.props;
        const statusStyle = isError ? styles.errorContainer : styles.noErrorContainer;
        const coloration = { color: iconColor, fontSize: iconSize };

        const renderInput = this.props.masked == true
            ? <TextInputMask
                type={this.props.maskType}
                options={this.props.maskOptions}
                style={[styles.textInput, coloration, inputStyle]}
                {...props} />
            : <TextInput style={[styles.textInput, coloration, inputStyle]} underlineColorAndroid="rgba(0,0,0,0)" {...props}/>

        return (
          <View style={[ styles.container, statusStyle, style]}>
              <Icon color={iconColor} name={iconName} size={iconSize}/>
              { renderInput }
          </View>
        );
    }
}

export default IconTextInput;
