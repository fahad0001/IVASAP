import React from 'react';
import moment from 'moment';
import {Dimensions} from "react-native";
import portalUrl from "../../config/portalUrl";
import {Location} from "expo";

export const calculateTimeMilli = (requests, isNurse) => {
    const filteredTime = requests.filter( request => {
        return moment().format('YYYY-MM-DD') === request['start_date'] &&
            moment().format('HH:mm') < moment(request['start_time'], ["hh::mma"]).format('HH:mm');
    });
    let timeInMilli = [];
    // requestData holds the data to be include with every interval
    filteredTime.forEach(itm => timeInMilli.push({
       time: transformTimeToMilli(itm['start_time']),
       requestData: {
           requestId: itm.id,
           nurseId: itm['nurse_id'],
           startDate: itm['start_date'],
           startTime: itm['start_time'], // internal setInterval termination will be handle by this value
           nurse: itm.nurse
       }
    }));
    return timeInMilli;
};

// This function will return time in millisecond with 30 minutes difference as required
// if 3o minutes difference make time less than time now than 30 minutes will not be subtracted
// instead it will take time now as base time.
const transformTimeToMilli = time => {
    let timeWithGap = moment(time, 'hh:mma').subtract(30, 'minutes').diff(moment());
    return timeWithGap > 0 ? timeWithGap : 5000;
};

export const setEventInterval = (timeEvents, handler, setNurseLocation, locationPermission) => {
    console.log(timeEvents);
    let timerStore = [];
    for(let i = 0; i < timeEvents.length; i++) {
        timerStore.push(setInterval(() => handler(i, timerStore[i], timeEvents[i], setNurseLocation, locationPermission), timeEvents[i].time))
    }
};

// This event handler if for user side
// This will be used to get location of nurse
export const eventTimerHandler = (id, timerInstance, timeEvent, setNurseLocation) => {
    let locationFetch = setInterval(() => {
        let flag = false; // if nurse reach the location this flag will be enabled from api
        fetch(`${portalUrl}/nurse_location?request_id=${timeEvent.requestData.requestId}`)
            .then(respJson => respJson.json())
            .then(response => {
                console.log(response);
                setNurseLocation(response);
                if(stopTimer(timeEvent.requestData.startTime, flag)) clearInterval(locationFetch)
            })
            .catch(error => {
                console.log(error);
                if(stopTimer(timeEvent.requestData.startTime, flag)) clearInterval(locationFetch)

            });

    }, 40000);
    console.log('hello', timeEvent.time);
    clearInterval(timerInstance);
};

// This event handler if for user side
// This will be used to get location of nurse
export const eventTimerHandlerNurse = (id, timerInstance, timeEvent, setNurseLocation, locationPermission) => {
    try {
        const {width, height} = Dimensions.get('window');
        const ASPECT_RATIO = width / height;
        const LATITUDE_DELTA = 0.0122;
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

        let currentPosition = setInterval(() => {
            let flag = false; // if nurse reach the location this flag will be enabled from api
            _syncPosition(locationPermission)
                .then(position => {
                    console.log(position.coords);
                    const region = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                        accuracy: position.coords.accuracy
                    };

                    const coordinate = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    const location = JSON.stringify({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null,
                        region,
                        coordinate
                    });

                    const payload = {
                        request_id: timeEvent.requestData.requestId,
                        nurse_id: 0,
                        username: 0,
                        location: location,
                        flag: false,
                        message: ''
                    };
                    setNurseLocation(payload);
                    fetch(`${portalUrl}/nurse_location`, {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            // "X-Code": item.confirmation_code
                        },
                        body: JSON.stringify({
                            nurse_location: payload
                        })
                    })
                        .then(response => {
                            console.log(response);
                            if (stopTimer(timeEvent.requestData.startTime, flag)) clearInterval(currentPosition)
                        })
                        .catch(error => {
                            if (stopTimer(timeEvent.requestData.startTime, flag)) clearInterval(currentPosition);
                            alert(error)
                        })
                })
                .catch((e) => {
                    // this one is firing the error instantly
                    alert(e + ' Please make sure your location (GPS) is turned on.');
                });

        }, 40000);
    }
    catch (e) {
        alert(e)
    }
    console.log('hello', timeEvent.time);
    clearInterval(timerInstance);
};

const _syncPosition = async (status) => {
    if (status === 'granted') {
        return Location.getCurrentPositionAsync({enableHighAccuracy: true})
    } else {
        throw new Error('Location permission not granted');
    }
};

const stopTimer = (terminateTime, flag) => terminateTime <= moment().format('hh:mma') || flag;
