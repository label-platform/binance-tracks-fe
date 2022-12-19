import { SECOND } from '@constants/common';
import { useEffect, useState } from 'react';

interface Props {
    defaultSecond: number;
    endFunction?: () => void;
}

export function useCountdown(props: Props) {
    const { defaultSecond, endFunction } = props;
    const [timer, setTimer] = useState(defaultSecond);
    const [isStart, setIsStart] = useState(false);

    useEffect(() => {
        if (timer === 0) {
            if (endFunction) endFunction();
            setIsStart(false);
        }
    }, [timer]);

    useEffect(() => {
        let intervalID = null;
        if (isStart) {
            intervalID = setInterval(() => {
                setTimer((time) => time - 1);
            }, SECOND);
        }
        return () => {
            if (isStart) {
                clearInterval(intervalID);
            }
        };
    }, [isStart]);

    const pause = () => {
        setIsStart((isStart) => !isStart);
    };

    const stop = () => {
        setTimer(0);
    };

    const start = () => {
        setIsStart(true);
        setTimer(defaultSecond);
    };

    return {
        timer,
        isStart,
        pause,
        start,
        stop,
    };
}
