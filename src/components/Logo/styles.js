import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const imageHeight = height;

export default EStyleSheet.create({
  $largeContainerWidth: width,
  $largeContainerHeight: height,

  container: {
    flex: 2,
    alignSelf: 'flex-start',
    width: '$largeContainerWidth',
    height: '$largeContainerHeight',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: 0,
    left: '10%',
    bottom: 0,
    right: '10%',
    width: 300,
  }
});
