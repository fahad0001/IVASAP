import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default EStyleSheet.create({
  title: {
    color: '$white',
    textAlign: 'center',
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    fontSize: 20,
    letterSpacing: 2,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  price: {
    fontSize: 20,
    textAlign: 'center',
    color: 'green'
  },
  attr: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: '2%',
    color: '$darkGrey',
  },
  subTitle: {
    fontSize: 20,
    color: '$aqua',
    marginTop: '5%',
    marginBottom: '2%',
  },
  description: {
    fontSize: 14,
    color: '$darkGrey',
    lineHeight: 26,
  },
  formula: {
    fontSize: 14,
    color: '$darkGrey',
    lineHeight: 26,
  },
  button: {
    backgroundColor: 'white',
    width: width / 1.75,
    height: height / 15,
    borderColor: '#371B92',
    borderWidth: 2,
    borderRadius: 25,
  },
  buttonContainer: {
    marginTop: 20,
  },
	listContainer: {
    marginBottom: 20,
  },
  noticeContainer: {
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
    right: 0,
    top: 0,
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
  },
  image: {
    width: '100%',
    height: '100%',
    flex: -1
  },
  innerContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingLeft: '4%',
    paddingRight: '4%',
    paddingBottom: '4%',
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center'
  },
  submitButton: {
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'green',
    width: 270,
    height: 42,
    padding: 10,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'green',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  submitButton2: {
    borderRadius: 21,
    borderWidth: 2,
    borderColor: 'red',
    width: 200,
    height: 42,
    padding: 10,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'red',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  }
});
