export const GET_USERS_INITIAL_LOCATION = 'GET USERS INITIAL LOCATION';
export const GET_USERS_CUSTOM_LOCATION = 'GET USERS CUSTOM LOCATION';
export const BOOK_SERVICES = 'BOOK SERVICES';
export const GET_NEARBY_NURSES = 'GET_NEARBY_NURSES';

//nurse location region
export const RECEIVED_NURSE_LOCATION = 'RECEIVED_NURSE_LOCATION';

export const getUsersInitialLocation = position => ({
  type: GET_USERS_INITIAL_LOCATION,
  coordinate: {
    longitude: position.coords.longitude,
    latitude: position.coords.latitude,
  },
});

export const getUsersCustomLocation = position => ({
  type: GET_USERS_CUSTOM_LOCATION,
  coordinate: {
    longitude: position.longitude,
    latitude: position.latitude,
  },
});

export const bookServices = user => ({
  type: BOOK_SERVICES,
  payload: {
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    coordinate: {
      longitude: user.coordinate.longitude,
      latitude: user.coordinate.latitude,
    },
  },
});

export const getNearbyNurses = nurses => ({
  type: GET_NEARBY_NURSES,
  payload: nurses,
});

// this action is for user side
// this action is intended to set nurse location fetched from user side
export const setNurseLocation = nurseLocation => ({
    type: RECEIVED_NURSE_LOCATION,
    payload: nurseLocation
});
