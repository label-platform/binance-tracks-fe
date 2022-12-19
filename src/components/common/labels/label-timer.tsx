import { SECOND } from '@constants/common';
import { convertTimeFormat } from '@utils/string';
import { Duration } from 'moment';
import { useLayoutEffect, useRef, useState } from 'react';
import { useInterval } from 'react-use';

interface Props {
    duration: Duration | null;
    interval?: number;
    format?: string;
}

export function TRLabelTimer(props: Props) {
    const { duration, format = 'hh:mm:ss', interval = SECOND } = props;
    const init = useRef(0);
    const [time, setTime] = useState('');

    useLayoutEffect(() => {
        init.current = duration.asMilliseconds();
    }, [!duration]);

    useInterval(() => {
        if (init.current > 0) {
            setTime(convertTimeFormat(init.current, format));
            init.current -= interval;
        }
    }, interval);

    return <>{time}</>;
}
