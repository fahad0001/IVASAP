import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default EStyleSheet.create({
  title: {
    color: '$white',
    textAlign: 'center',
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    fontSize: 20,
    letterSpacing: 2,
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
  imageContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  image: {
      width: '100%',
      height: '100%',
      flex: 2
  },
  innerContainer: {
      position: 'relative',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      alignSelf: 'center',
      justifyContent: 'center'
  },
});
