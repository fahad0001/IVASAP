import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginLeft: '5%',
        marginRight: '5%'
    },
    title: {
        fontSize: 18,
        color: 'teal',
        marginBottom: 4,
        marginTop: 8
    },
    description: {
        fontSize: 14,
        color: '#202020',
        marginBottom: 4
    },
    submitButton: {
        marginBottom: 8,
        borderRadius: 21,
        borderWidth: 2,
        borderColor: '#45e8eb',
        width: 'auto',
        height: 42,
        padding: 10,
        alignSelf: 'center',
        textAlign: 'center',
        color: '#19bec1',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    digitInputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: '10%',
        marginRight: '10%'
    },
    digitInput: {
        fontSize: 24,
        borderBottomWidth: 2,
        borderBottomColor: 'black',
        marginBottom: 8,
        width: 15*6
    }
});

/**
 * Input type for handling a token like an MFA token.  This is a modal wrapper
 * for the six digit input type.
 *
 * @class TokenInput
 * @extends React.Component
 */
class ModalTokenInput extends React.Component {
    /**
     * Default properties for this component.
     */
    static defaultProps = {
        // Determines if the modal is visible or not
        isVisible: false,

        // Specific UI components
        title: 'Enter Token',
        description: 'Enter the token you were sent.',
        buttonTitle: 'Confirm',
        style: '',

        // If a controlled component, these will be set
        value: '',
        onChange: (value) => { /* console.log(`New Value: ${value}`); */ },

        // If not a controlled component, then these will be set
        onSubmit: (value) => { /* console.log(`Submitted Value: ${value}`) */ }
    };

    /**
     * Constructor - sets up state properly.
     *
     * @param {Object} props provided props (either from the defaultProps or the passed in props)
     * @member ModalTokenInput
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = {
            value: props.value.substr(0, 6)
        };
    }

    /**
     * Event handler called when the input string is changed.
     *
     * @param {String} value the new value of the input
     * @member ModalTokenInput
     */
    onChange(value) {
        this.props.onChange(value.trim());
        this.setState({ value: value });
    }

    /**
     * Event handler called when the input string is submitted
     *
     * @param {String} value the value of the input
     * @member ModalTokenInput
     */
    onSubmit() {
        this.props.onSubmit(this.state.value.trim());
    }

    /**
     * React lifecycle method - renders the component
     * @member ModalTokenInput
     */
    render() {
        const settings = {
            digitInput: {
                autoCorrect: false,
                autoFocus: true,
                keyboardType: 'numeric',
                maxLength: 6,
                secureTextEntry: false,
                onChangeText: (text) => this.onChange(text),
                style: styles.digitInput
            }
        };

        return (
            <Modal isVisible={this.props.isVisible}>
                <View style={[styles.container, this.props.style]}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.description}>{this.props.description}</Text>
                    <View style={styles.digitInputContainer}>
                        <TextInput {...settings.digitInput}/>
                    </View>
                    <TouchableOpacity disabled={this.state.value.length !== 6} onPress={() => this.onSubmit()}>
                      <Text style={styles.submitButton}>{ this.props.buttonTitle.toUpperCase() }</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        )
    }
}

export default ModalTokenInput;
