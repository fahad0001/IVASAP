import moment from 'moment';

export const calculateTimeMilli = (requests, isNurse) => {
    const filteredTime = requests.filter( request => {
        return moment().format('YYYY-MM-DD') === request['start_date']
            && moment().format('hh:mma') < request['start_time'];
    });
    let timeInMilli = [];
    // requestData holds the data to be include with every interval
    filteredTime.forEach(itm => timeInMilli.push({
       time: transformTimeToMilli(itm['start_time']),
       requestData: {
           id: itm.id,
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
    return timeWithGap > 0 ? timeWithGap : moment(time, 'hh:mma').diff(moment());
};

export const setEventInterval = (timeEvents) => {
    console.log(timeEvents);
    let timerStore = [];
    for(let i = 0; i < timeEvents.length; i++) {
        timerStore.push(setInterval(() => eventTimerHandler(i, timerStore[i], timeEvents[i]), timeEvents[i].time))
    }
    console.log(timerStore);
};

const eventTimerHandler = (id, timerInstance, timeEvent) => {
    let locationFetch = setInterval(() => {
        let flag = false; // if nurse reach the location this flag will be enabled from api
        // payload to send: nurse_id, username, request_id
        // response from api: nurse_id, location, flag, message
        if(stopTimer(timeEvent.requestData.startTime, flag)) clearInterval(locationFetch)
    }, 60000);
    console.log('hello', timeEvent.time);
    clearInterval(timerInstance);
};

const stopTimer = (terminateTime, flag) =>  terminateTime <= moment().format('YYYY-MM-DD') && flag;
