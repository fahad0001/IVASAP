import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default EStyleSheet.create({
  buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 20,
  },
  errorContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
  },
  error: {
      backgroundColor: 'red',
      color: 'white',
      alignSelf: 'center',
      paddingLeft: 8,
      paddingRight: 8
  },
  successContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
  },
  success: {
      backgroundColor: 'green',
      color: 'white',
      alignSelf: 'center',
      paddingLeft: 8,
      paddingRight: 8
  },
  attr: {
    fontSize: 12,
    color: '$darkGrey'
  },
  flexGrow: {
      flex: 1
  },
  formContainer: {
      width: '100%'
  },
  signUpForm: {
      marginLeft: '10%',
      marginRight: '10%',
      marginTop: '35%',
  }
});
