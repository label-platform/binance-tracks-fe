import moment from 'moment-timezone';

export const calculateDuration = (endtime, starttime?, timezone = 'Europe/London'): moment.Duration => {
    const startTime = starttime
        ? moment(starttime).tz(timezone).utc()
        : moment.tz(timezone).utc().format('YYYY-MM-DD HH:mm:ss');
    const endTime = moment(endtime).tz(timezone).utc();
    const duration = moment.duration(endTime.diff(startTime));

    return duration;
};

export const checkIsDateFinished = (endtime, starttime?): boolean => {
    const { _milliseconds } = calculateDuration(endtime, starttime) as any;
    return _milliseconds < 0;
};
